using Fexora.Core.DTOs;
using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class DmcaService(FexoraDbContext db) : IDmcaService
{
    public async Task<DmcaReport> CreateReportAsync(Guid reporterId, string contentId, string originalUrl, string description, string? evidenceUrlsJson)
    {
        if (!Guid.TryParse(contentId, out var cId))
            throw new ArgumentException("Ungültige Content-ID.");

        var content = await db.Contents.FindAsync(cId)
            ?? throw new ArgumentException("Content nicht gefunden.");

        var report = new DmcaReport
        {
            Id = Guid.NewGuid(),
            ReporterId = reporterId,
            ContentId = cId,
            OriginalUrl = originalUrl,
            Description = description,
            EvidenceUrlsJson = evidenceUrlsJson,
            Status = DmcaStatus.Pending
        };

        db.DmcaReports.Add(report);
        await db.SaveChangesAsync();
        return report;
    }

    public async Task<DmcaReport?> GetReportAsync(Guid reportId)
    {
        return await db.DmcaReports
            .Include(r => r.Reporter)
            .Include(r => r.Content)
            .Include(r => r.ReviewedBy)
            .FirstOrDefaultAsync(r => r.Id == reportId);
    }

    public async Task<PaginatedResult<DmcaReport>> GetReportsAsync(string? status, int page, int pageSize)
    {
        var query = db.DmcaReports
            .Include(r => r.Reporter)
            .Include(r => r.Content)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<DmcaStatus>(status, true, out var s))
            query = query.Where(r => r.Status == s);

        var total = await query.CountAsync();
        var data = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResult<DmcaReport> { Data = data, Total = total, Page = page, PageSize = pageSize };
    }

    public async Task ReviewReportAsync(Guid reportId, Guid reviewerId, bool approve, string? comment)
    {
        var report = await db.DmcaReports
            .Include(r => r.Content)
            .FirstOrDefaultAsync(r => r.Id == reportId)
            ?? throw new ArgumentException("Report nicht gefunden.");

        if (report.Status != DmcaStatus.Pending && report.Status != DmcaStatus.Reviewing)
            throw new InvalidOperationException("Report kann in diesem Status nicht reviewed werden.");

        report.ReviewedById = reviewerId;
        report.ReviewComment = comment;
        report.ReviewedAt = DateTime.UtcNow;

        if (approve)
        {
            report.Status = DmcaStatus.TakenDown;
            report.Content.Status = ContentStatus.TakenDown;
        }
        else
        {
            report.Status = DmcaStatus.Rejected;
        }

        await db.SaveChangesAsync();
    }
}
