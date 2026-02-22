using Fexora.Core.Enums;

namespace Fexora.Core.Entities;

public class ScenarioExecution
{
    public Guid Id { get; set; }
    public Guid EnrollmentId { get; set; }
    public Guid StepId { get; set; }
    public ExecutionResult Result { get; set; } = ExecutionResult.Pending;
    public string? ErrorMessage { get; set; }
    public int RetryCount { get; set; }
    public DateTime ScheduledAt { get; set; }
    public DateTime? ExecutedAt { get; set; }
    public string? ConsentStatusSnapshot { get; set; }

    public ScenarioEnrollment Enrollment { get; set; } = null!;
    public ScenarioStep Step { get; set; } = null!;
}
