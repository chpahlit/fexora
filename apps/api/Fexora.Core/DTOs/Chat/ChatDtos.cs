namespace Fexora.Core.DTOs.Chat;

public class ThreadResponse
{
    public Guid Id { get; set; }
    public Guid OtherUserId { get; set; }
    public string OtherUsername { get; set; } = string.Empty;
    public string? OtherAvatarUrl { get; set; }
    public MessageResponse? LastMessage { get; set; }
    public int UnreadCount { get; set; }
    public DateTime LastActivityAt { get; set; }
}

public class MessageResponse
{
    public Guid Id { get; set; }
    public Guid ThreadId { get; set; }
    public Guid SenderId { get; set; }
    public string SenderUsername { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string? MediaUrl { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class SendMessageRequest
{
    public Guid ReceiverId { get; set; }
    public string Body { get; set; } = string.Empty;
}
