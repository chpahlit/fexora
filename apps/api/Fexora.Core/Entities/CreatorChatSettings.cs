namespace Fexora.Core.Entities;

public class CreatorChatSettings
{
    public Guid CreatorId { get; set; }
    public int MessagePriceCredits { get; set; }
    public bool AllowFreeMessages { get; set; } = true;
    public int FreeMessagesPerDay { get; set; } = 3;
    public bool AutoReplyEnabled { get; set; }
    public string? AutoReplyMessage { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User Creator { get; set; } = null!;
}
