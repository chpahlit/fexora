namespace Fexora.Core.DTOs.Wallet;

public class WalletResponse
{
    public int Balance { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class TransactionResponse
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public int Amount { get; set; }
    public string? GatewayRef { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class TopupRequest
{
    public string PackId { get; set; } = string.Empty;
}

public class TopupResponse
{
    public string CheckoutUrl { get; set; } = string.Empty;
    public string SessionId { get; set; } = string.Empty;
}

public class UnlockRequest
{
    public Guid ContentId { get; set; }
}

public class UnlockResponse
{
    public bool Success { get; set; }
    public int NewBalance { get; set; }
    public Guid PurchaseId { get; set; }
}
