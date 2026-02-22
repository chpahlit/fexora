using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Fexora.Orchestrator;

public class OrchestratorService(
    IServiceScopeFactory scopeFactory,
    ILogger<OrchestratorService> logger) : BackgroundService
{
    private const int BatchSize = 100;
    private static readonly TimeSpan TickInterval = TimeSpan.FromMinutes(1);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Orchestrator service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessDueEnrollmentsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in orchestrator tick");
            }

            await Task.Delay(TickInterval, stoppingToken);
        }

        logger.LogInformation("Orchestrator service stopped");
    }

    private async Task ProcessDueEnrollmentsAsync(CancellationToken ct)
    {
        using var scope = scopeFactory.CreateScope();
        var scenarioService = scope.ServiceProvider.GetRequiredService<IScenarioService>();
        var rateLimitService = scope.ServiceProvider.GetRequiredService<IRateLimitService>();
        var complianceService = scope.ServiceProvider.GetRequiredService<IComplianceService>();
        var workers = scope.ServiceProvider.GetRequiredService<IEnumerable<IActionWorker>>();

        // Check quiet hours
        if (await rateLimitService.IsQuietHoursAsync())
        {
            logger.LogDebug("Quiet hours active, skipping tick");
            return;
        }

        // Check global limit
        if (await rateLimitService.IsGlobalLimitReachedAsync())
        {
            logger.LogWarning("Global rate limit reached, skipping tick");
            return;
        }

        var enrollments = await scenarioService.GetDueEnrollmentsAsync(DateTime.UtcNow, BatchSize);
        if (enrollments.Count == 0) return;

        logger.LogInformation("Processing {Count} due enrollments", enrollments.Count);

        var db = scope.ServiceProvider.GetRequiredService<Infrastructure.Data.FexoraDbContext>();

        foreach (var enrollment in enrollments)
        {
            if (ct.IsCancellationRequested) break;

            var steps = enrollment.Scenario.Steps.OrderBy(s => s.StepOrder).ToList();
            if (enrollment.CurrentStepIndex >= steps.Count)
            {
                enrollment.Status = EnrollmentStatus.Completed;
                enrollment.CompletedAt = DateTime.UtcNow;
                await db.SaveChangesAsync();
                continue;
            }

            var step = steps[enrollment.CurrentStepIndex];

            // Check if step is due (day offset from enrollment)
            var dueAt = enrollment.EnrolledAt
                .AddDays(step.DayOffset)
                .AddMinutes(step.TimeOffsetMinutes);

            if (DateTime.UtcNow < dueAt) continue;

            // Compliance check
            if (!await complianceService.CanExecuteActionAsync(enrollment.UserId))
            {
                LogExecution(db, enrollment.Id, step.Id, ExecutionResult.OptedOut);
                enrollment.Status = EnrollmentStatus.OptOut;
                enrollment.OptedOutAt = DateTime.UtcNow;
                await db.SaveChangesAsync();
                continue;
            }

            // Rate limit check
            if (!await rateLimitService.CanExecuteAsync(enrollment.UserId, step.RateLimitConfigJson))
            {
                LogExecution(db, enrollment.Id, step.Id, ExecutionResult.RateLimited);
                await db.SaveChangesAsync();
                continue;
            }

            // Find matching worker
            var worker = workers.FirstOrDefault(w => w.ActionType == step.ActionType);
            if (worker is null)
            {
                logger.LogWarning("No worker found for action type {ActionType}", step.ActionType);
                LogExecution(db, enrollment.Id, step.Id, ExecutionResult.Failed, "No worker found");
                await db.SaveChangesAsync();
                continue;
            }

            // Execute
            try
            {
                var result = await worker.ExecuteAsync(step, enrollment.UserId);
                LogExecution(db, enrollment.Id, step.Id, result);

                if (result is ExecutionResult.Success or ExecutionResult.Skipped)
                {
                    enrollment.CurrentStepIndex++;
                    await rateLimitService.IncrementAsync(enrollment.UserId);
                    await rateLimitService.IncrementGlobalAsync();

                    if (enrollment.CurrentStepIndex >= steps.Count)
                    {
                        enrollment.Status = EnrollmentStatus.Completed;
                        enrollment.CompletedAt = DateTime.UtcNow;
                    }
                }

                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Worker execution failed for enrollment {EnrollmentId}", enrollment.Id);
                LogExecution(db, enrollment.Id, step.Id, ExecutionResult.Failed, ex.Message);
                await db.SaveChangesAsync();
            }
        }
    }

    private static void LogExecution(
        Infrastructure.Data.FexoraDbContext db,
        Guid enrollmentId,
        Guid stepId,
        ExecutionResult result,
        string? error = null)
    {
        db.ScenarioExecutions.Add(new Core.Entities.ScenarioExecution
        {
            EnrollmentId = enrollmentId,
            StepId = stepId,
            Result = result,
            ErrorMessage = error,
            ScheduledAt = DateTime.UtcNow,
            ExecutedAt = DateTime.UtcNow
        });
    }
}
