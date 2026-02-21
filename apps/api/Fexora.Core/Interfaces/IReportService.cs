using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;

namespace Fexora.Core.Interfaces;

public interface IReportService
{
    Task<Guid> CreateReport(Guid reporterId, CreateReportRequest request);
    Task<PaginatedResult<ReportResponse>> GetReports(string? status, int page, int pageSize);
    Task<ReportResponse?> GetReportById(Guid reportId);
    Task<bool> ResolveReport(Guid reportId, Guid reviewerId, ResolveReportRequest request);
}
