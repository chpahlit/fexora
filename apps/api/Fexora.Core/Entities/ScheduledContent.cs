namespace Fexora.Core.Entities;

public class ScheduledContent
{
    public Guid Id { get; set; }
    public Guid ContentId { get; set; }
    public DateTime ScheduledAt { get; set; }
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Content Content { get; set; } = null!;
}
