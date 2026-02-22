namespace Fexora.Core.Entities;

public class Like
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid? ContentId { get; set; }
    public Guid? CommentId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Content? Content { get; set; }
    public Comment? Comment { get; set; }
}
