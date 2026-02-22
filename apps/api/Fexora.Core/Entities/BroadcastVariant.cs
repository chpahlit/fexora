namespace Fexora.Core.Entities;

public class BroadcastVariant
{
    public Guid Id { get; set; }
    public Guid BroadcastId { get; set; }
    public string VariantName { get; set; } = "A";
    public Guid TemplateId { get; set; }
    public int WeightPercent { get; set; } = 100;
    public int SendCount { get; set; }
    public int ResponseCount { get; set; }
    public int UnlockCount { get; set; }

    public Broadcast Broadcast { get; set; } = null!;
    public MessageTemplate Template { get; set; } = null!;
}
