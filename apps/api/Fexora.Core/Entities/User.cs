using Fexora.Core.Enums;

namespace Fexora.Core.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public Role Role { get; set; } = Role.User;
    public bool IsVerified18 { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsShadowBanned { get; set; }
    public string? BlockReason { get; set; }
    public bool ConsentPrivacyPolicy { get; set; }
    public bool ConsentTermsOfService { get; set; }
    public DateTime? ConsentGivenAt { get; set; }
    public DateTime? DataExportRequestedAt { get; set; }
    public DateTime? DataDeletionRequestedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Profile? Profile { get; set; }
    public CreditWallet? Wallet { get; set; }
    public TwoFactorAuth? TwoFactorAuth { get; set; }
    public ICollection<Content> Contents { get; set; } = [];
    public ICollection<Message> SentMessages { get; set; } = [];
    public ICollection<Purchase> Purchases { get; set; } = [];
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
    public ICollection<Like> Likes { get; set; } = [];
    public ICollection<Comment> Comments { get; set; } = [];
    public ICollection<Follow> Followers { get; set; } = [];
    public ICollection<Follow> Following { get; set; } = [];
    public ICollection<Notification> Notifications { get; set; } = [];
    public ICollection<Favorite> Favorites { get; set; } = [];
    public ICollection<Subscription> Subscriptions { get; set; } = [];
}
