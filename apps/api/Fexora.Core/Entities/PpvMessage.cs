namespace Fexora.Core.Entities;

public class PpvMessage
{
    public Guid Id { get; set; }
    public Guid MessageId { get; set; }
    public int PriceCredits { get; set; }
    public string? PreviewText { get; set; }

    public Message Message { get; set; } = null!;
    public ICollection<PpvUnlock> Unlocks { get; set; } = [];
}

public class PpvUnlock
{
    public Guid Id { get; set; }
    public Guid PpvMessageId { get; set; }
    public Guid UserId { get; set; }
    public int PaidCredits { get; set; }
    public DateTime UnlockedAt { get; set; } = DateTime.UtcNow;

    public PpvMessage PpvMessage { get; set; } = null!;
    public User User { get; set; } = null!;
}
