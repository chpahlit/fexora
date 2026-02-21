namespace Fexora.Core.Entities;

public class Message
{
    public Guid Id { get; set; }
    public Guid ThreadId { get; set; }
    public Guid SenderId { get; set; }
    public Guid ReceiverId { get; set; }
    public string Body { get; set; } = string.Empty;
    public string? MediaUrl { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Thread Thread { get; set; } = null!;
    public User Sender { get; set; } = null!;
}
