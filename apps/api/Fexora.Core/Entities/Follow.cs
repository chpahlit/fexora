namespace Fexora.Core.Entities;

public class Follow
{
    public Guid Id { get; set; }
    public Guid FollowerId { get; set; }
    public Guid FolloweeId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Follower { get; set; } = null!;
    public User Followee { get; set; } = null!;
}
