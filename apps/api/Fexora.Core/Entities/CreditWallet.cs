namespace Fexora.Core.Entities;

public class CreditWallet
{
    public Guid UserId { get; set; }
    public int Balance { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public ICollection<CreditTransaction> Transactions { get; set; } = [];
}
