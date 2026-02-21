using Fexora.Core.DTOs.Admin;
using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class AnalyticsService(FexoraDbContext db) : IAnalyticsService
{
    public async Task<DashboardStats> GetDashboardStats()
    {
        var today = DateTime.UtcNow.Date;

        var totalUsers = await db.Users.CountAsync();
        var totalCreators = await db.Users.CountAsync(u => u.Role == Role.Creator || u.Role == Role.Admin);
        var totalContent = await db.Contents.CountAsync();
        var pendingReviews = await db.Contents.CountAsync(c => c.Status == ContentStatus.Pending);
        var openReports = await db.Reports.CountAsync(r => r.Status == ReportStatus.Open || r.Status == ReportStatus.InReview);
        var totalCredits = await db.CreditWallets.SumAsync(w => w.Balance);
        var todayNewUsers = await db.Users.CountAsync(u => u.CreatedAt >= today);
        var todayUnlocks = await db.Purchases.CountAsync(p => p.CreatedAt >= today);

        var todayTopups = await db.CreditTransactions
            .Where(t => t.Type == CreditTransactionType.Topup && t.CreatedAt >= today)
            .SumAsync(t => (decimal?)t.Amount) ?? 0;

        return new DashboardStats
        {
            TotalUsers = totalUsers,
            TotalCreators = totalCreators,
            TotalContent = totalContent,
            PendingReviews = pendingReviews,
            OpenReports = openReports,
            TotalCreditsCirculating = totalCredits,
            TodayNewUsers = todayNewUsers,
            TodayUnlocks = todayUnlocks,
            TodayRevenue = todayTopups,
        };
    }

    public async Task<List<RevenueDataPoint>> GetRevenueHistory(int days)
    {
        var startDate = DateTime.UtcNow.Date.AddDays(-days);

        var transactions = await db.CreditTransactions
            .Where(t => t.Type == CreditTransactionType.Topup && t.CreatedAt >= startDate)
            .GroupBy(t => t.CreatedAt.Date)
            .Select(g => new RevenueDataPoint
            {
                Date = g.Key,
                Revenue = g.Sum(t => t.Amount),
                Transactions = g.Count(),
            })
            .OrderBy(r => r.Date)
            .ToListAsync();

        return transactions;
    }

    public async Task<ContentStats> GetContentStats()
    {
        return new ContentStats
        {
            Total = await db.Contents.CountAsync(),
            Approved = await db.Contents.CountAsync(c => c.Status == ContentStatus.Approved),
            Pending = await db.Contents.CountAsync(c => c.Status == ContentStatus.Pending),
            Rejected = await db.Contents.CountAsync(c => c.Status == ContentStatus.Rejected),
            Removed = await db.Contents.CountAsync(c => c.Status == ContentStatus.Removed),
        };
    }
}
