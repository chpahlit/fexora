namespace Fexora.Core.Entities;

public class FeedEvent
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string EventType { get; set; } = string.Empty; // "post", "share", "story"
    public Guid EntityId { get; set; }
    public double Score { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
