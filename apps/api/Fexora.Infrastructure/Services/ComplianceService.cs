using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class ComplianceService(FexoraDbContext db) : IComplianceService
{
    public async Task<bool> CanExecuteActionAsync(Guid userId)
    {
        if (await IsBlacklistedAsync(userId))
            return false;

        if (!await HasMarketingConsentAsync(userId))
            return false;

        // Check if user is opted out of orchestrator
        var isOptedOut = await db.ScenarioEnrollments
            .AnyAsync(e => e.UserId == userId && e.Status == Core.Enums.EnrollmentStatus.OptOut);
        if (isOptedOut)
            return false;

        return true;
    }

    public async Task<bool> IsBlacklistedAsync(Guid userId)
    {
        return await db.OrchestratorBlacklists.AnyAsync(b => b.UserId == userId);
    }

    public async Task AddToBlacklistAsync(Guid userId, string? reason)
    {
        if (await IsBlacklistedAsync(userId))
            return;

        db.OrchestratorBlacklists.Add(new OrchestratorBlacklist
        {
            UserId = userId,
            Reason = reason
        });
        await db.SaveChangesAsync();
    }

    public async Task RemoveFromBlacklistAsync(Guid userId)
    {
        var entry = await db.OrchestratorBlacklists.FirstOrDefaultAsync(b => b.UserId == userId);
        if (entry is not null)
        {
            db.OrchestratorBlacklists.Remove(entry);
            await db.SaveChangesAsync();
        }
    }

    public async Task<bool> HasMarketingConsentAsync(Guid userId)
    {
        var user = await db.Users.FindAsync(userId);
        // ConsentPrivacyPolicy serves as marketing consent for now
        return user?.ConsentPrivacyPolicy == true && user.IsActive;
    }
}
