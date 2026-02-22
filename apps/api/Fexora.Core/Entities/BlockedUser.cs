namespace Fexora.Core.Entities;

public class BlockedUser
{
    public Guid Id { get; set; }
    public Guid BlockerId { get; set; }
    public Guid BlockedId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Blocker { get; set; } = null!;
    public User Blocked { get; set; } = null!;
}
