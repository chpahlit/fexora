using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class AdminUserService(FexoraDbContext db, IAuditService audit) : IAdminUserService
{
    public async Task<PaginatedResult<AdminUserResponse>> GetUsers(string? search, string? role, int page, int pageSize)
    {
        var query = db.Users.Include(u => u.Profile).Include(u => u.Wallet).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(u =>
                u.Email.ToLower().Contains(s) ||
                (u.Profile != null && u.Profile.Username.ToLower().Contains(s)));
        }

        if (!string.IsNullOrWhiteSpace(role) && Enum.TryParse<Role>(role, true, out var roleEnum))
        {
            query = query.Where(u => u.Role == roleEnum);
        }

        var total = await query.CountAsync();
        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new AdminUserResponse
            {
                Id = u.Id,
                Email = u.Email,
                Username = u.Profile != null ? u.Profile.Username : "",
                Role = u.Role.ToString(),
                IsActive = u.IsActive,
                IsShadowBanned = u.IsShadowBanned,
                IsVerified18 = u.IsVerified18,
                AvatarUrl = u.Profile != null ? u.Profile.AvatarUrl : null,
                ContentCount = u.Contents.Count,
                CreditBalance = u.Wallet != null ? u.Wallet.Balance : 0,
                CreatedAt = u.CreatedAt,
            })
            .ToListAsync();

        return new PaginatedResult<AdminUserResponse> { Data = users, Total = total, Page = page, PageSize = pageSize };
    }

    public async Task<AdminUserResponse?> GetUserById(Guid userId)
    {
        return await db.Users
            .Include(u => u.Profile)
            .Include(u => u.Wallet)
            .Where(u => u.Id == userId)
            .Select(u => new AdminUserResponse
            {
                Id = u.Id,
                Email = u.Email,
                Username = u.Profile != null ? u.Profile.Username : "",
                Role = u.Role.ToString(),
                IsActive = u.IsActive,
                IsShadowBanned = u.IsShadowBanned,
                IsVerified18 = u.IsVerified18,
                AvatarUrl = u.Profile != null ? u.Profile.AvatarUrl : null,
                ContentCount = u.Contents.Count,
                CreditBalance = u.Wallet != null ? u.Wallet.Balance : 0,
                CreatedAt = u.CreatedAt,
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateRole(Guid userId, string role, Guid actorId)
    {
        if (!Enum.TryParse<Role>(role, true, out var roleEnum)) return false;

        var user = await db.Users.FindAsync(userId);
        if (user == null) return false;

        var oldRole = user.Role;
        user.Role = roleEnum;
        await db.SaveChangesAsync();

        await audit.Log(actorId, "UpdateRole", "User", userId, $"{oldRole} -> {roleEnum}", null);
        return true;
    }

    public async Task<bool> BlockUser(Guid userId, string? reason, Guid actorId)
    {
        var user = await db.Users.FindAsync(userId);
        if (user == null) return false;

        user.IsActive = false;
        user.BlockReason = reason;
        await db.SaveChangesAsync();

        await audit.Log(actorId, "BlockUser", "User", userId, reason, null);
        return true;
    }

    public async Task<bool> UnblockUser(Guid userId, Guid actorId)
    {
        var user = await db.Users.FindAsync(userId);
        if (user == null) return false;

        user.IsActive = true;
        user.BlockReason = null;
        await db.SaveChangesAsync();

        await audit.Log(actorId, "UnblockUser", "User", userId, null, null);
        return true;
    }

    public async Task<bool> SetShadowBan(Guid userId, bool isShadowBanned, Guid actorId)
    {
        var user = await db.Users.FindAsync(userId);
        if (user == null) return false;

        user.IsShadowBanned = isShadowBanned;
        await db.SaveChangesAsync();

        await audit.Log(actorId, isShadowBanned ? "ShadowBan" : "RemoveShadowBan", "User", userId, null, null);
        return true;
    }
}
