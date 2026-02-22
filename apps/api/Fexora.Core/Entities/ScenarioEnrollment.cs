using Fexora.Core.Enums;

namespace Fexora.Core.Entities;

public class ScenarioEnrollment
{
    public Guid Id { get; set; }
    public Guid ScenarioId { get; set; }
    public Guid UserId { get; set; }
    public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Active;
    public int CurrentStepIndex { get; set; }
    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public DateTime? OptedOutAt { get; set; }

    public Scenario Scenario { get; set; } = null!;
    public User User { get; set; } = null!;
    public ICollection<ScenarioExecution> Executions { get; set; } = [];
}
