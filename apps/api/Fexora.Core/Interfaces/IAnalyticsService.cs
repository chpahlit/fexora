using Fexora.Core.DTOs.Admin;

namespace Fexora.Core.Interfaces;

public interface IAnalyticsService
{
    Task<DashboardStats> GetDashboardStats();
    Task<List<RevenueDataPoint>> GetRevenueHistory(int days);
    Task<ContentStats> GetContentStats();
}
