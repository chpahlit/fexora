using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;
using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class AuditService(FexoraDbContext db) : IAuditService
{
    public async Task Log(Guid actorId, string action, string entityType, Guid? entityId, string? details, string? ipAddress)
    {
        db.AuditLogs.Add(new AuditLog
        {
            Id = Guid.NewGuid(),
            ActorId = actorId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            Details = details,
            IpAddress = ipAddress,
            CreatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync();
    }

    public async Task<PaginatedResult<AuditLogResponse>> GetLogs(string? entityType, Guid? actorId, int page, int pageSize)
    {
        var query = db.AuditLogs.Include(a => a.Actor).ThenInclude(u => u.Profile).AsQueryable();

        if (!string.IsNullOrWhiteSpace(entityType))
            query = query.Where(a => a.EntityType == entityType);

        if (actorId.HasValue)
            query = query.Where(a => a.ActorId == actorId.Value);

        var total = await query.CountAsync();
        var logs = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new AuditLogResponse
            {
                Id = a.Id,
                ActorId = a.ActorId,
                ActorUsername = a.Actor.Profile != null ? a.Actor.Profile.Username : a.Actor.Email,
                Action = a.Action,
                EntityType = a.EntityType,
                EntityId = a.EntityId,
                Details = a.Details,
                IpAddress = a.IpAddress,
                CreatedAt = a.CreatedAt,
            })
            .ToListAsync();

        return new PaginatedResult<AuditLogResponse> { Data = logs, Total = total, Page = page, PageSize = pageSize };
    }
}
