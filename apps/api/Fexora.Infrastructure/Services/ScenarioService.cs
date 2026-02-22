using Fexora.Core.DTOs;
using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class ScenarioService(FexoraDbContext db) : IScenarioService
{
    public async Task<Scenario> CreateAsync(string name, string? description)
    {
        var scenario = new Scenario
        {
            Name = name,
            Description = description,
            Status = ScenarioStatus.Draft
        };
        db.Scenarios.Add(scenario);
        await db.SaveChangesAsync();
        return scenario;
    }

    public async Task<Scenario?> GetAsync(Guid id)
    {
        return await db.Scenarios
            .Include(s => s.Steps.OrderBy(st => st.StepOrder))
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<PaginatedResult<Scenario>> ListAsync(int page, int pageSize)
    {
        var query = db.Scenarios.OrderByDescending(s => s.CreatedAt);
        var total = await query.CountAsync();
        var data = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PaginatedResult<Scenario> { Data = data, Total = total, Page = page, PageSize = pageSize };
    }

    public async Task UpdateAsync(Guid id, string? name, string? description)
    {
        var scenario = await db.Scenarios.FindAsync(id)
            ?? throw new ArgumentException("Scenario not found.");
        if (name is not null) scenario.Name = name;
        if (description is not null) scenario.Description = description;
        scenario.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    public async Task ActivateAsync(Guid id)
    {
        var scenario = await db.Scenarios.Include(s => s.Steps).FirstOrDefaultAsync(s => s.Id == id)
            ?? throw new ArgumentException("Scenario not found.");
        if (scenario.Steps.Count == 0)
            throw new InvalidOperationException("Scenario must have at least one step.");
        scenario.Status = ScenarioStatus.Active;
        scenario.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    public async Task PauseAsync(Guid id)
    {
        var scenario = await db.Scenarios.FindAsync(id)
            ?? throw new ArgumentException("Scenario not found.");
        scenario.Status = ScenarioStatus.Paused;
        scenario.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    public async Task ArchiveAsync(Guid id)
    {
        var scenario = await db.Scenarios.FindAsync(id)
            ?? throw new ArgumentException("Scenario not found.");
        scenario.Status = ScenarioStatus.Archived;
        scenario.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    public async Task AddStepAsync(Guid scenarioId, ScenarioStep step)
    {
        var scenario = await db.Scenarios.FindAsync(scenarioId)
            ?? throw new ArgumentException("Scenario not found.");
        step.ScenarioId = scenarioId;
        var maxOrder = await db.ScenarioSteps
            .Where(s => s.ScenarioId == scenarioId)
            .MaxAsync(s => (int?)s.StepOrder) ?? 0;
        step.StepOrder = maxOrder + 1;
        db.ScenarioSteps.Add(step);
        await db.SaveChangesAsync();
    }

    public async Task RemoveStepAsync(Guid stepId)
    {
        var step = await db.ScenarioSteps.FindAsync(stepId);
        if (step is not null)
        {
            db.ScenarioSteps.Remove(step);
            await db.SaveChangesAsync();
        }
    }

    public async Task EnrollUserAsync(Guid scenarioId, Guid userId)
    {
        // Check if already enrolled in any active scenario
        var existing = await db.ScenarioEnrollments
            .AnyAsync(e => e.UserId == userId && e.Status == EnrollmentStatus.Active);
        if (existing) return;

        var enrollment = new ScenarioEnrollment
        {
            ScenarioId = scenarioId,
            UserId = userId,
            Status = EnrollmentStatus.Active,
            CurrentStepIndex = 0
        };
        db.ScenarioEnrollments.Add(enrollment);
        await db.SaveChangesAsync();
    }

    public async Task OptOutUserAsync(Guid userId)
    {
        var enrollments = await db.ScenarioEnrollments
            .Where(e => e.UserId == userId && e.Status == EnrollmentStatus.Active)
            .ToListAsync();

        foreach (var enrollment in enrollments)
        {
            enrollment.Status = EnrollmentStatus.OptOut;
            enrollment.OptedOutAt = DateTime.UtcNow;
        }
        await db.SaveChangesAsync();
    }

    public async Task<List<ScenarioEnrollment>> GetDueEnrollmentsAsync(DateTime now, int batchSize)
    {
        return await db.ScenarioEnrollments
            .Include(e => e.Scenario)
                .ThenInclude(s => s.Steps.OrderBy(st => st.StepOrder))
            .Include(e => e.User)
            .Where(e => e.Status == EnrollmentStatus.Active)
            .Where(e => e.Scenario.Status == ScenarioStatus.Active)
            .Take(batchSize)
            .ToListAsync();
    }
}
