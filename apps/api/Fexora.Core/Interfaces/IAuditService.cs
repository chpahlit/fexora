using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;

namespace Fexora.Core.Interfaces;

public interface IAuditService
{
    Task Log(Guid actorId, string action, string entityType, Guid? entityId, string? details, string? ipAddress);
    Task<PaginatedResult<AuditLogResponse>> GetLogs(string? entityType, Guid? actorId, int page, int pageSize);
}
