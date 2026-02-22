namespace Fexora.Core.Entities;

public class Comment
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ContentId { get; set; }
    public Guid? ParentId { get; set; }
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public User User { get; set; } = null!;
    public Content Content { get; set; } = null!;
    public Comment? Parent { get; set; }
    public ICollection<Comment> Replies { get; set; } = [];
    public ICollection<Like> Likes { get; set; } = [];
}
