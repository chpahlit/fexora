namespace Fexora.Core.DTOs.Admin;

public class AdminUserResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public bool IsShadowBanned { get; set; }
    public bool IsVerified18 { get; set; }
    public string? AvatarUrl { get; set; }
    public int ContentCount { get; set; }
    public int CreditBalance { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UpdateUserRoleRequest
{
    public string Role { get; set; } = string.Empty;
}

public class BlockUserRequest
{
    public string? Reason { get; set; }
}

public class ShadowBanRequest
{
    public bool IsShadowBanned { get; set; }
}
