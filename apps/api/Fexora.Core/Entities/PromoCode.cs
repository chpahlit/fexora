namespace Fexora.Core.Entities;

public class PromoCode
{
    public Guid Id { get; set; }
    public Guid CreatorId { get; set; }
    public string Code { get; set; } = string.Empty;
    public int DiscountPercent { get; set; }
    public int? MaxRedemptions { get; set; }
    public int CurrentRedemptions { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Creator { get; set; } = null!;
    public ICollection<PromoRedemption> Redemptions { get; set; } = [];
}

public class PromoRedemption
{
    public Guid Id { get; set; }
    public Guid PromoCodeId { get; set; }
    public Guid UserId { get; set; }
    public int DiscountAppliedCredits { get; set; }
    public DateTime RedeemedAt { get; set; } = DateTime.UtcNow;

    public PromoCode PromoCode { get; set; } = null!;
    public User User { get; set; } = null!;
}
