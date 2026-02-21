namespace Fexora.Core.DTOs.Admin;

public class ModeratorKpiResponse
{
    public Guid ModeratorId { get; set; }
    public string Username { get; set; } = string.Empty;
    public int TodayMessages { get; set; }
    public int TodayDialogs { get; set; }
    public int TodayUnlocks { get; set; }
    public int TodayRevenue { get; set; }
    public double AvgResponseTimeSec { get; set; }
    public bool IsOnline { get; set; }
}

public class TeamLeaderboardEntry
{
    public Guid ModeratorId { get; set; }
    public string Username { get; set; } = string.Empty;
    public int Messages { get; set; }
    public int Dialogs { get; set; }
    public int AttributedUnlocks { get; set; }
    public int AttributedRevenue { get; set; }
    public decimal Compensation { get; set; }
    public double AvgResponseTimeSec { get; set; }
}

public class CompensationReportResponse
{
    public Guid Id { get; set; }
    public Guid ModeratorId { get; set; }
    public string Username { get; set; } = string.Empty;
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
    public DateTime CalculatedAt { get; set; }
}
