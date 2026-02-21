namespace Fexora.Core.DTOs.Admin;

public class DashboardStats
{
    public int TotalUsers { get; set; }
    public int TotalCreators { get; set; }
    public int TotalContent { get; set; }
    public int PendingReviews { get; set; }
    public int OpenReports { get; set; }
    public int TotalCreditsCirculating { get; set; }
    public int TodayNewUsers { get; set; }
    public int TodayUnlocks { get; set; }
    public decimal TodayRevenue { get; set; }
}

public class RevenueDataPoint
{
    public DateTime Date { get; set; }
    public decimal Revenue { get; set; }
    public int Transactions { get; set; }
}

public class ContentStats
{
    public int Total { get; set; }
    public int Approved { get; set; }
    public int Pending { get; set; }
    public int Rejected { get; set; }
    public int Removed { get; set; }
}
