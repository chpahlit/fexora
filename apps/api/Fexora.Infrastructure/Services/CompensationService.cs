using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;
using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class CompensationService(FexoraDbContext db) : ICompensationService
{
    // Default compensation: 0.05€ per message + 10% of attributed revenue
    // Agency/individual rates can override these defaults
    private const decimal DefaultPerMessageRate = 0.05m;
    private const decimal DefaultRevenueSharePercent = 0.10m;

    private async Task<(decimal perMessage, decimal revenueShare)> GetModeratorRates(Guid moderatorId)
    {
        var agencyMod = await db.Set<AgencyModerator>()
            .Include(am => am.Agency)
            .FirstOrDefaultAsync(am => am.ModeratorId == moderatorId && am.IsActive && am.Agency.IsActive);

        if (agencyMod is null)
            return (DefaultPerMessageRate, DefaultRevenueSharePercent);

        // Custom rate per moderator, or agency default, minus agency cut
        var perMsg = agencyMod.CustomPerMessageRate ?? agencyMod.Agency.PerMessageRate;
        var revShare = agencyMod.CustomRevenueSharePercent ?? agencyMod.Agency.RevenueSharePercent;
        var agencyCut = agencyMod.Agency.AgencyCutPercent;

        // Moderator gets the rate minus the agency cut
        return (perMsg * (1 - agencyCut), revShare * (1 - agencyCut));
    }

    public async Task<ModeratorKpiResponse> GetLiveKpis(Guid moderatorId)
    {
        var today = DateTime.UtcNow.Date;
        var user = await db.Users.Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == moderatorId);

        var todayMessages = await db.Messages
            .CountAsync(m => m.SenderId == moderatorId && m.CreatedAt >= today);

        var todayDialogs = await db.Messages
            .Where(m => m.SenderId == moderatorId && m.CreatedAt >= today)
            .Select(m => m.ThreadId)
            .Distinct()
            .CountAsync();

        var todayUnlocks = await db.Purchases
            .CountAsync(p => p.AttributedToModeratorId == moderatorId && p.CreatedAt >= today);

        var todayRevenue = await db.Purchases
            .Where(p => p.AttributedToModeratorId == moderatorId && p.CreatedAt >= today)
            .SumAsync(p => (int?)p.PriceCredits) ?? 0;

        // Average response time: time between user message and moderator reply
        var avgResponseTime = await CalculateAvgResponseTime(moderatorId, today);

        return new ModeratorKpiResponse
        {
            ModeratorId = moderatorId,
            Username = user?.Profile?.Username ?? "",
            TodayMessages = todayMessages,
            TodayDialogs = todayDialogs,
            TodayUnlocks = todayUnlocks,
            TodayRevenue = todayRevenue,
            AvgResponseTimeSec = avgResponseTime,
        };
    }

    public async Task<List<ModeratorKpiResponse>> GetAllModeratorKpis()
    {
        var moderators = await db.Users
            .Include(u => u.Profile)
            .Where(u => u.Role == Role.Moderator || u.Role == Role.Admin)
            .ToListAsync();

        var result = new List<ModeratorKpiResponse>();
        foreach (var mod in moderators)
        {
            result.Add(await GetLiveKpis(mod.Id));
        }
        return result;
    }

    public async Task<List<TeamLeaderboardEntry>> GetLeaderboard(DateTime from, DateTime to)
    {
        var moderators = await db.Users
            .Include(u => u.Profile)
            .Where(u => u.Role == Role.Moderator || u.Role == Role.Admin)
            .ToListAsync();

        var entries = new List<TeamLeaderboardEntry>();

        foreach (var mod in moderators)
        {
            var messages = await db.Messages
                .CountAsync(m => m.SenderId == mod.Id && m.CreatedAt >= from && m.CreatedAt <= to);

            var dialogs = await db.Messages
                .Where(m => m.SenderId == mod.Id && m.CreatedAt >= from && m.CreatedAt <= to)
                .Select(m => m.ThreadId)
                .Distinct()
                .CountAsync();

            var unlocks = await db.Purchases
                .CountAsync(p => p.AttributedToModeratorId == mod.Id && p.CreatedAt >= from && p.CreatedAt <= to);

            var revenue = await db.Purchases
                .Where(p => p.AttributedToModeratorId == mod.Id && p.CreatedAt >= from && p.CreatedAt <= to)
                .SumAsync(p => (int?)p.PriceCredits) ?? 0;

            var avgResponse = await CalculateAvgResponseTime(mod.Id, from);

            var (perMsg, revShare) = await GetModeratorRates(mod.Id);
            var fixedComp = messages * perMsg;
            var revenueComp = revenue * revShare;

            entries.Add(new TeamLeaderboardEntry
            {
                ModeratorId = mod.Id,
                Username = mod.Profile?.Username ?? "",
                Messages = messages,
                Dialogs = dialogs,
                AttributedUnlocks = unlocks,
                AttributedRevenue = revenue,
                Compensation = fixedComp + revenueComp,
                AvgResponseTimeSec = avgResponse,
            });
        }

        return entries.OrderByDescending(e => e.Compensation).ToList();
    }

    public async Task<CompensationReportResponse> CalculateCompensation(Guid moderatorId, DateTime from, DateTime to)
    {
        var user = await db.Users.Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == moderatorId);

        var messages = await db.Messages
            .CountAsync(m => m.SenderId == moderatorId && m.CreatedAt >= from && m.CreatedAt <= to);

        var dialogs = await db.Messages
            .Where(m => m.SenderId == moderatorId && m.CreatedAt >= from && m.CreatedAt <= to)
            .Select(m => m.ThreadId)
            .Distinct()
            .CountAsync();

        var unlocks = await db.Purchases
            .CountAsync(p => p.AttributedToModeratorId == moderatorId && p.CreatedAt >= from && p.CreatedAt <= to);

        var revenue = await db.Purchases
            .Where(p => p.AttributedToModeratorId == moderatorId && p.CreatedAt >= from && p.CreatedAt <= to)
            .SumAsync(p => (int?)p.PriceCredits) ?? 0;

        var avgResponse = await CalculateAvgResponseTime(moderatorId, from);

        var (perMsg, revShare) = await GetModeratorRates(moderatorId);
        var fixedComp = messages * perMsg;
        var revenueComp = revenue * revShare;
        var totalComp = fixedComp + revenueComp;

        // Save to database
        var record = new ModeratorCompensation
        {
            Id = Guid.NewGuid(),
            ModeratorId = moderatorId,
            PeriodStart = from,
            PeriodEnd = to,
            TotalMessages = messages,
            TotalDialogs = dialogs,
            AttributedUnlocks = unlocks,
            AttributedRevenue = revenue,
            FixedCompensation = fixedComp,
            RevenueShare = revenueComp,
            TotalCompensation = totalComp,
            AvgResponseTimeSec = avgResponse,
            CalculatedAt = DateTime.UtcNow,
        };
        db.ModeratorCompensations.Add(record);
        await db.SaveChangesAsync();

        return new CompensationReportResponse
        {
            Id = record.Id,
            ModeratorId = moderatorId,
            Username = user?.Profile?.Username ?? "",
            PeriodStart = from,
            PeriodEnd = to,
            TotalMessages = messages,
            TotalDialogs = dialogs,
            AttributedUnlocks = unlocks,
            AttributedRevenue = revenue,
            FixedCompensation = fixedComp,
            RevenueShare = revenueComp,
            TotalCompensation = totalComp,
            AvgResponseTimeSec = avgResponse,
            CalculatedAt = record.CalculatedAt,
        };
    }

    public async Task<PaginatedResult<CompensationReportResponse>> GetCompensationReports(int page, int pageSize)
    {
        var query = db.ModeratorCompensations
            .Include(c => c.Moderator).ThenInclude(u => u.Profile)
            .OrderByDescending(c => c.CalculatedAt);

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CompensationReportResponse
            {
                Id = c.Id,
                ModeratorId = c.ModeratorId,
                Username = c.Moderator.Profile != null ? c.Moderator.Profile.Username : "",
                PeriodStart = c.PeriodStart,
                PeriodEnd = c.PeriodEnd,
                TotalMessages = c.TotalMessages,
                TotalDialogs = c.TotalDialogs,
                AttributedUnlocks = c.AttributedUnlocks,
                AttributedRevenue = c.AttributedRevenue,
                FixedCompensation = c.FixedCompensation,
                RevenueShare = c.RevenueShare,
                TotalCompensation = c.TotalCompensation,
                AvgResponseTimeSec = c.AvgResponseTimeSec,
                CalculatedAt = c.CalculatedAt,
            })
            .ToListAsync();

        return new PaginatedResult<CompensationReportResponse>
        {
            Data = items, Total = total, Page = page, PageSize = pageSize
        };
    }

    private async Task<double> CalculateAvgResponseTime(Guid moderatorId, DateTime from)
    {
        // Get threads where moderator participated
        var threads = await db.Threads
            .Where(t => t.UserAId == moderatorId || t.UserBId == moderatorId)
            .Select(t => t.Id)
            .ToListAsync();

        if (threads.Count == 0) return 0;

        // Get moderator messages in those threads ordered by time
        var modMessages = await db.Messages
            .Where(m => threads.Contains(m.ThreadId) && m.SenderId == moderatorId && m.CreatedAt >= from)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new { m.ThreadId, m.CreatedAt })
            .ToListAsync();

        if (modMessages.Count == 0) return 0;

        var responseTimes = new List<double>();

        foreach (var modMsg in modMessages)
        {
            // Find the most recent user message before this moderator message
            var lastUserMsg = await db.Messages
                .Where(m => m.ThreadId == modMsg.ThreadId
                    && m.SenderId != moderatorId
                    && m.CreatedAt < modMsg.CreatedAt)
                .OrderByDescending(m => m.CreatedAt)
                .Select(m => m.CreatedAt)
                .FirstOrDefaultAsync();

            if (lastUserMsg != default)
            {
                responseTimes.Add((modMsg.CreatedAt - lastUserMsg).TotalSeconds);
            }
        }

        return responseTimes.Count > 0 ? responseTimes.Average() : 0;
    }
}
