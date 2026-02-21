using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;

namespace Fexora.Core.Interfaces;

public interface ICompensationService
{
    Task<ModeratorKpiResponse> GetLiveKpis(Guid moderatorId);
    Task<List<ModeratorKpiResponse>> GetAllModeratorKpis();
    Task<List<TeamLeaderboardEntry>> GetLeaderboard(DateTime from, DateTime to);
    Task<CompensationReportResponse> CalculateCompensation(Guid moderatorId, DateTime from, DateTime to);
    Task<PaginatedResult<CompensationReportResponse>> GetCompensationReports(int page, int pageSize);
}
