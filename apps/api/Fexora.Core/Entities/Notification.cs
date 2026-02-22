using Fexora.Core.Enums;

namespace Fexora.Core.Entities;

public class Notification
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public NotificationType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Body { get; set; }
    public Guid? ActorId { get; set; }
    public Guid? EntityId { get; set; }
    public string? EntityType { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public User? Actor { get; set; }
}
