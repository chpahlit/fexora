using Fexora.Core.Enums;

namespace Fexora.Core.Entities;

public class ScenarioStep
{
    public Guid Id { get; set; }
    public Guid ScenarioId { get; set; }
    public int StepOrder { get; set; }
    public int DayOffset { get; set; }
    public int TimeOffsetMinutes { get; set; }
    public ActionType ActionType { get; set; }
    public Guid? SenderProfileId { get; set; }
    public Guid? TemplateId { get; set; }
    public string? TargetingQueryJson { get; set; }
    public string? RateLimitConfigJson { get; set; }
    public string? ContentIdTarget { get; set; }

    public Scenario Scenario { get; set; } = null!;
    public MessageTemplate? Template { get; set; }
}
