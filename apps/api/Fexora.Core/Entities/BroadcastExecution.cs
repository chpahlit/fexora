using Fexora.Core.Enums;

namespace Fexora.Core.Entities;

public class BroadcastExecution
{
    public Guid Id { get; set; }
    public Guid BroadcastId { get; set; }
    public Guid VariantId { get; set; }
    public Guid UserId { get; set; }
    public ExecutionResult Result { get; set; } = ExecutionResult.Pending;
    public DateTime ScheduledAt { get; set; }
    public DateTime? ExecutedAt { get; set; }

    public Broadcast Broadcast { get; set; } = null!;
    public BroadcastVariant Variant { get; set; } = null!;
}
