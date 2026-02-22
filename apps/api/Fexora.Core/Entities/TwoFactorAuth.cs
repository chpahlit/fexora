namespace Fexora.Core.Entities;

public class TwoFactorAuth
{
    public Guid UserId { get; set; }
    public bool IsEnabled { get; set; }
    public string? SecretEncrypted { get; set; }
    public string? BackupCodesJson { get; set; }
    public DateTime? EnabledAt { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
