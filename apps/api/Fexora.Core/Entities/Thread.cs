namespace Fexora.Core.Entities;

public class Thread
{
    public Guid Id { get; set; }
    public Guid UserAId { get; set; }
    public Guid UserBId { get; set; }
    public Guid? AssignedModeratorId { get; set; }
    public DateTime LastActivityAt { get; set; } = DateTime.UtcNow;

    public User UserA { get; set; } = null!;
    public User UserB { get; set; } = null!;
    public User? AssignedModerator { get; set; }
    public ICollection<Message> Messages { get; set; } = [];
}
