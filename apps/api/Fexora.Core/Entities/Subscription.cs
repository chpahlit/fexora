using Fexora.Core.Enums;

namespace Fexora.Core.Entities;

public class Subscription
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid CreatorId { get; set; }
    public Guid TierId { get; set; }
    public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime CurrentPeriodEnd { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? ExternalId { get; set; } // Stripe subscription ID

    public User User { get; set; } = null!;
    public User Creator { get; set; } = null!;
    public SubscriptionTier Tier { get; set; } = null!;
}
