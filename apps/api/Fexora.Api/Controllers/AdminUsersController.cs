using System.Security.Claims;
using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("admin/users")]
[Authorize(Policy = "Admin")]
public class AdminUsersController(IAdminUserService userService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetUsers(
        [FromQuery] string? search,
        [FromQuery] string? role,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await userService.GetUsers(search, role, page, pageSize);
        return Ok(ApiResponse<PaginatedResult<AdminUserResponse>>.Ok(result));
    }

    [HttpGet("{userId:guid}")]
    public async Task<IActionResult> GetUser(Guid userId)
    {
        var user = await userService.GetUserById(userId);
        if (user == null) return NotFound(ApiResponse<object>.Fail("User not found"));
        return Ok(ApiResponse<AdminUserResponse>.Ok(user));
    }

    [HttpPut("{userId:guid}/role")]
    public async Task<IActionResult> UpdateRole(Guid userId, [FromBody] UpdateUserRoleRequest request)
    {
        var actorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var success = await userService.UpdateRole(userId, request.Role, actorId);
        if (!success) return BadRequest(ApiResponse<object>.Fail("Invalid role or user not found"));
        return Ok(ApiResponse<object>.Ok(new { success = true }));
    }

    [HttpPost("{userId:guid}/block")]
    public async Task<IActionResult> BlockUser(Guid userId, [FromBody] BlockUserRequest request)
    {
        var actorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var success = await userService.BlockUser(userId, request.Reason, actorId);
        if (!success) return NotFound(ApiResponse<object>.Fail("User not found"));
        return Ok(ApiResponse<object>.Ok(new { success = true }));
    }

    [HttpPost("{userId:guid}/unblock")]
    public async Task<IActionResult> UnblockUser(Guid userId)
    {
        var actorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var success = await userService.UnblockUser(userId, actorId);
        if (!success) return NotFound(ApiResponse<object>.Fail("User not found"));
        return Ok(ApiResponse<object>.Ok(new { success = true }));
    }

    [HttpPut("{userId:guid}/shadowban")]
    public async Task<IActionResult> SetShadowBan(Guid userId, [FromBody] ShadowBanRequest request)
    {
        var actorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var success = await userService.SetShadowBan(userId, request.IsShadowBanned, actorId);
        if (!success) return NotFound(ApiResponse<object>.Fail("User not found"));
        return Ok(ApiResponse<object>.Ok(new { success = true }));
    }
}
