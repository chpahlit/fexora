using Fexora.Core.DTOs;
using Fexora.Core.Entities;

namespace Fexora.Core.Interfaces;

public interface IDmcaService
{
    Task<DmcaReport> CreateReportAsync(Guid reporterId, string contentId, string originalUrl, string description, string? evidenceUrlsJson);
    Task<DmcaReport?> GetReportAsync(Guid reportId);
    Task<PaginatedResult<DmcaReport>> GetReportsAsync(string? status, int page, int pageSize);
    Task ReviewReportAsync(Guid reportId, Guid reviewerId, bool approve, string? comment);
}
