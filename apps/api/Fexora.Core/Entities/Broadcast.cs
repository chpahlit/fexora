using Fexora.Core.Enums;

namespace Fexora.Core.Entities;

public class Broadcast
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public BroadcastStatus Status { get; set; } = BroadcastStatus.Draft;
    public string TargetingQueryJson { get; set; } = string.Empty;
    public Guid SenderProfileId { get; set; }
    public int EstimatedRecipients { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public bool IsDryRun { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<BroadcastVariant> Variants { get; set; } = [];
    public ICollection<BroadcastExecution> Executions { get; set; } = [];
}
