using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;

namespace Fexora.Core.Interfaces;

public interface IAdminUserService
{
    Task<PaginatedResult<AdminUserResponse>> GetUsers(string? search, string? role, int page, int pageSize);
    Task<AdminUserResponse?> GetUserById(Guid userId);
    Task<bool> UpdateRole(Guid userId, string role, Guid actorId);
    Task<bool> BlockUser(Guid userId, string? reason, Guid actorId);
    Task<bool> UnblockUser(Guid userId, Guid actorId);
    Task<bool> SetShadowBan(Guid userId, bool isShadowBanned, Guid actorId);
}
