using Fexora.Core.DTOs.Admin;
using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class AgencyService(FexoraDbContext db) : IAgencyService
{
    public async Task<List<AgencyResponse>> GetAll()
    {
        return await db.Agencies
            .Include(a => a.Owner).ThenInclude(u => u.Profile)
            .Include(a => a.Moderators)
            .OrderBy(a => a.Name)
            .Select(a => new AgencyResponse
            {
                Id = a.Id,
                Name = a.Name,
                OwnerUsername = a.Owner.Profile != null ? a.Owner.Profile.Username : a.Owner.Email,
                PerMessageRate = a.PerMessageRate,
                RevenueSharePercent = a.RevenueSharePercent,
                AgencyCutPercent = a.AgencyCutPercent,
                ModeratorCount = a.Moderators.Count(m => m.IsActive),
                IsActive = a.IsActive,
                CreatedAt = a.CreatedAt,
            })
            .ToListAsync();
    }

    public async Task<AgencyResponse?> GetById(Guid agencyId)
    {
        return await db.Agencies
            .Include(a => a.Owner).ThenInclude(u => u.Profile)
            .Include(a => a.Moderators)
            .Where(a => a.Id == agencyId)
            .Select(a => new AgencyResponse
            {
                Id = a.Id,
                Name = a.Name,
                OwnerUsername = a.Owner.Profile != null ? a.Owner.Profile.Username : a.Owner.Email,
                PerMessageRate = a.PerMessageRate,
                RevenueSharePercent = a.RevenueSharePercent,
                AgencyCutPercent = a.AgencyCutPercent,
                ModeratorCount = a.Moderators.Count(m => m.IsActive),
                IsActive = a.IsActive,
                CreatedAt = a.CreatedAt,
            })
            .FirstOrDefaultAsync();
    }

    public async Task<Guid> Create(CreateAgencyRequest request)
    {
        var agency = new Agency
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            OwnerId = request.OwnerId,
            PerMessageRate = request.PerMessageRate,
            RevenueSharePercent = request.RevenueSharePercent,
            AgencyCutPercent = request.AgencyCutPercent,
            CreatedAt = DateTime.UtcNow,
        };
        db.Agencies.Add(agency);
        await db.SaveChangesAsync();
        return agency.Id;
    }

    public async Task<bool> Update(Guid agencyId, UpdateAgencyRequest request)
    {
        var agency = await db.Agencies.FindAsync(agencyId);
        if (agency == null) return false;

        if (request.Name is not null) agency.Name = request.Name;
        if (request.PerMessageRate.HasValue) agency.PerMessageRate = request.PerMessageRate.Value;
        if (request.RevenueSharePercent.HasValue) agency.RevenueSharePercent = request.RevenueSharePercent.Value;
        if (request.AgencyCutPercent.HasValue) agency.AgencyCutPercent = request.AgencyCutPercent.Value;

        await db.SaveChangesAsync();
        return true;
    }

    public async Task<List<AgencyModeratorResponse>> GetModerators(Guid agencyId)
    {
        var agency = await db.Agencies.FindAsync(agencyId);
        if (agency == null) return [];

        return await db.Set<AgencyModerator>()
            .Include(am => am.Moderator).ThenInclude(u => u.Profile)
            .Where(am => am.AgencyId == agencyId)
            .Select(am => new AgencyModeratorResponse
            {
                ModeratorId = am.ModeratorId,
                Username = am.Moderator.Profile != null ? am.Moderator.Profile.Username : am.Moderator.Email,
                EffectivePerMessageRate = am.CustomPerMessageRate ?? agency.PerMessageRate,
                EffectiveRevenueSharePercent = am.CustomRevenueSharePercent ?? agency.RevenueSharePercent,
                JoinedAt = am.JoinedAt,
                IsActive = am.IsActive,
            })
            .ToListAsync();
    }

    public async Task<bool> AddModerator(Guid agencyId, AddAgencyModeratorRequest request)
    {
        var exists = await db.Set<AgencyModerator>()
            .AnyAsync(am => am.AgencyId == agencyId && am.ModeratorId == request.ModeratorId);
        if (exists) return false;

        db.Set<AgencyModerator>().Add(new AgencyModerator
        {
            AgencyId = agencyId,
            ModeratorId = request.ModeratorId,
            CustomPerMessageRate = request.CustomPerMessageRate,
            CustomRevenueSharePercent = request.CustomRevenueSharePercent,
            JoinedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveModerator(Guid agencyId, Guid moderatorId)
    {
        var am = await db.Set<AgencyModerator>()
            .FirstOrDefaultAsync(x => x.AgencyId == agencyId && x.ModeratorId == moderatorId);
        if (am == null) return false;

        am.IsActive = false;
        await db.SaveChangesAsync();
        return true;
    }
}
