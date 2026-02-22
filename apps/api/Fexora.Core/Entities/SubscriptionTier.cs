namespace Fexora.Core.Entities;

public class SubscriptionTier
{
    public Guid Id { get; set; }
    public Guid CreatorId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int PriceCreditsMonthly { get; set; }
    public decimal? PriceEurMonthly { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Creator { get; set; } = null!;
    public ICollection<Subscription> Subscriptions { get; set; } = [];
}
