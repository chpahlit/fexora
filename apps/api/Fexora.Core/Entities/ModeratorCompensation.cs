namespace Fexora.Core.Entities;

public class ModeratorCompensation
{
    public Guid Id { get; set; }
    public Guid ModeratorId { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public int TotalMessages { get; set; }
    public int TotalDialogs { get; set; }
    public int AttributedUnlocks { get; set; }
    public int AttributedRevenue { get; set; }
    public decimal FixedCompensation { get; set; }
    public decimal RevenueShare { get; set; }
    public decimal TotalCompensation { get; set; }
    public double AvgResponseTimeSec { get; set; }
    public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;

    public User Moderator { get; set; } = null!;
}
