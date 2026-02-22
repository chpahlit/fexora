using Fexora.Core.Enums;

namespace Fexora.Core.Entities;

public class CustomRequest
{
    public Guid Id { get; set; }
    public Guid RequesterId { get; set; }
    public Guid CreatorId { get; set; }
    public string Description { get; set; } = string.Empty;
    public int PriceCredits { get; set; }
    public int EscrowCredits { get; set; }
    public CustomRequestStatus Status { get; set; } = CustomRequestStatus.Pending;
    public DateTime? DeadlineAt { get; set; }
    public Guid? DeliveredContentId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    public User Requester { get; set; } = null!;
    public User Creator { get; set; } = null!;
    public Content? DeliveredContent { get; set; }
}
