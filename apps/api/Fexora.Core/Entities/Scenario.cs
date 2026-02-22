using Fexora.Core.Enums;

namespace Fexora.Core.Entities;

public class Scenario
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ScenarioStatus Status { get; set; } = ScenarioStatus.Draft;
    public int Priority { get; set; } = 100;
    public string? TriggerType { get; set; }
    public string? TriggerConfigJson { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ScenarioStep> Steps { get; set; } = [];
    public ICollection<ScenarioEnrollment> Enrollments { get; set; } = [];
}
