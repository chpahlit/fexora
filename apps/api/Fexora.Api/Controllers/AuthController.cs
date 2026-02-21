using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Auth;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register(RegisterRequest request)
    {
        try
        {
            var result = await authService.RegisterAsync(request);
            return Ok(ApiResponse<AuthResponse>.Ok(result));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail(ex.Message));
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login(LoginRequest request)
    {
        try
        {
            var result = await authService.LoginAsync(request);
            return Ok(ApiResponse<AuthResponse>.Ok(result));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<AuthResponse>.Fail(ex.Message));
        }
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Refresh(RefreshRequest request)
    {
        try
        {
            var result = await authService.RefreshAsync(request.RefreshToken);
            return Ok(ApiResponse<AuthResponse>.Ok(result));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<AuthResponse>.Fail(ex.Message));
        }
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult<ApiResponse<bool>>> Logout(RefreshRequest request)
    {
        await authService.RevokeAsync(request.RefreshToken);
        return Ok(ApiResponse<bool>.Ok(true));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<UserInfo>>> Me()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId is null || !Guid.TryParse(userId, out var id))
            return Unauthorized(ApiResponse<UserInfo>.Fail("Nicht authentifiziert."));

        var userInfo = await authService.GetUserInfoAsync(id);
        if (userInfo is null)
            return NotFound(ApiResponse<UserInfo>.Fail("Benutzer nicht gefunden."));

        return Ok(ApiResponse<UserInfo>.Ok(userInfo));
    }
}
