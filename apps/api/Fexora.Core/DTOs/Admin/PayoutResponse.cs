namespace Fexora.Core.DTOs.Admin;

public class PayoutResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Note { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class CreatePayoutRequest
{
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public string? Note { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
}

public class UpdatePayoutStatusRequest
{
    public string Status { get; set; } = string.Empty;
    public string? GatewayRef { get; set; }
}
