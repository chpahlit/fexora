using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;
using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class ReportService(FexoraDbContext db) : IReportService
{
    public async Task<Guid> CreateReport(Guid reporterId, CreateReportRequest request)
    {
        if (!Enum.TryParse<ReportReason>(request.Reason, true, out var reason))
            throw new ArgumentException("Invalid report reason");

        var report = new Report
        {
            Id = Guid.NewGuid(),
            ReporterId = reporterId,
            TargetUserId = request.TargetUserId,
            TargetContentId = request.TargetContentId,
            TargetMessageId = request.TargetMessageId,
            Reason = reason,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow,
        };

        db.Reports.Add(report);
        await db.SaveChangesAsync();
        return report.Id;
    }

    public async Task<PaginatedResult<ReportResponse>> GetReports(string? status, int page, int pageSize)
    {
        var query = db.Reports
            .Include(r => r.Reporter).ThenInclude(u => u.Profile)
            .Include(r => r.TargetUser).ThenInclude(u => u!.Profile)
            .Include(r => r.TargetContent)
            .Include(r => r.ReviewedBy).ThenInclude(u => u!.Profile)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<ReportStatus>(status, true, out var statusEnum))
            query = query.Where(r => r.Status == statusEnum);

        var total = await query.CountAsync();
        var reports = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new ReportResponse
            {
                Id = r.Id,
                ReporterId = r.ReporterId,
                ReporterUsername = r.Reporter.Profile != null ? r.Reporter.Profile.Username : r.Reporter.Email,
                TargetUserId = r.TargetUserId,
                TargetUsername = r.TargetUser != null && r.TargetUser.Profile != null ? r.TargetUser.Profile.Username : null,
                TargetContentId = r.TargetContentId,
                TargetContentTitle = r.TargetContent != null ? r.TargetContent.Title : null,
                Reason = r.Reason.ToString(),
                Description = r.Description,
                Status = r.Status.ToString(),
                ReviewedByUsername = r.ReviewedBy != null && r.ReviewedBy.Profile != null ? r.ReviewedBy.Profile.Username : null,
                ReviewNote = r.ReviewNote,
                CreatedAt = r.CreatedAt,
                ResolvedAt = r.ResolvedAt,
            })
            .ToListAsync();

        return new PaginatedResult<ReportResponse> { Data = reports, Total = total, Page = page, PageSize = pageSize };
    }

    public async Task<ReportResponse?> GetReportById(Guid reportId)
    {
        return await db.Reports
            .Include(r => r.Reporter).ThenInclude(u => u.Profile)
            .Include(r => r.TargetUser).ThenInclude(u => u!.Profile)
            .Include(r => r.TargetContent)
            .Include(r => r.ReviewedBy).ThenInclude(u => u!.Profile)
            .Where(r => r.Id == reportId)
            .Select(r => new ReportResponse
            {
                Id = r.Id,
                ReporterId = r.ReporterId,
                ReporterUsername = r.Reporter.Profile != null ? r.Reporter.Profile.Username : r.Reporter.Email,
                TargetUserId = r.TargetUserId,
                TargetUsername = r.TargetUser != null && r.TargetUser.Profile != null ? r.TargetUser.Profile.Username : null,
                TargetContentId = r.TargetContentId,
                TargetContentTitle = r.TargetContent != null ? r.TargetContent.Title : null,
                Reason = r.Reason.ToString(),
                Description = r.Description,
                Status = r.Status.ToString(),
                ReviewedByUsername = r.ReviewedBy != null && r.ReviewedBy.Profile != null ? r.ReviewedBy.Profile.Username : null,
                ReviewNote = r.ReviewNote,
                CreatedAt = r.CreatedAt,
                ResolvedAt = r.ResolvedAt,
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> ResolveReport(Guid reportId, Guid reviewerId, ResolveReportRequest request)
    {
        if (!Enum.TryParse<ReportStatus>(request.Status, true, out var status)) return false;
        if (status != ReportStatus.Resolved && status != ReportStatus.Dismissed) return false;

        var report = await db.Reports.FindAsync(reportId);
        if (report == null) return false;

        report.Status = status;
        report.ReviewedById = reviewerId;
        report.ReviewNote = request.ReviewNote;
        report.ResolvedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return true;
    }
}
