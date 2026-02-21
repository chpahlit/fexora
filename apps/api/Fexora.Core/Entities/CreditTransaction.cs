namespace Fexora.Core.Entities;

public enum CreditTransactionType
{
    Topup,
    Purchase,
    Refund
}

public class CreditTransaction
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public CreditTransactionType Type { get; set; }
    public int Amount { get; set; }
    public string? GatewayRef { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public CreditWallet Wallet { get; set; } = null!;
}
