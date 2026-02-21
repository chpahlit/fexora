namespace Fexora.Core.Entities;

public enum PayoutStatus
{
    Pending,
    Processing,
    Completed,
    Failed
}

public class PayoutRecord
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "EUR";
    public PayoutStatus Status { get; set; } = PayoutStatus.Pending;
    public string? GatewayRef { get; set; }
    public string? Note { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    public User User { get; set; } = null!;
}
