namespace Fexora.Core.Entities;

public class ReferralCode
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Code { get; set; } = string.Empty;
    public int RewardCredits { get; set; } = 50;
    public int MaxRedemptions { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public ICollection<ReferralRedemption> Redemptions { get; set; } = [];
}

public class ReferralRedemption
{
    public Guid Id { get; set; }
    public Guid ReferralCodeId { get; set; }
    public Guid RedeemedByUserId { get; set; }
    public int CreditsBonusReferrer { get; set; }
    public int CreditsBonusReferred { get; set; }
    public DateTime RedeemedAt { get; set; } = DateTime.UtcNow;

    public ReferralCode ReferralCode { get; set; } = null!;
    public User RedeemedByUser { get; set; } = null!;
}
