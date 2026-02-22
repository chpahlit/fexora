using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Auth;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController(IAuthService authService, PasswordResetService passwordResetService, LoginProtectionService loginProtection) : ControllerBase
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
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        // Check lockout status
        var status = await loginProtection.CheckAsync(request.Email, ip);
        if (status.IsLocked)
            return StatusCode(429, ApiResponse<AuthResponse>.Fail(
                $"Konto temporär gesperrt. Bitte warte {status.LockoutMinutes} Minuten."));

        try
        {
            var result = await authService.LoginAsync(request);
            await loginProtection.ResetAsync(request.Email, ip);
            return Ok(ApiResponse<AuthResponse>.Ok(result));
        }
        catch (UnauthorizedAccessException ex)
        {
            await loginProtection.RecordFailedAttemptAsync(request.Email, ip);
            return Unauthorized(ApiResponse<AuthResponse>.Fail(ex.Message));
        }
    }

    [HttpGet("login/status")]
    public async Task<ActionResult<ApiResponse<LoginProtectionStatus>>> LoginStatus([FromQuery] string email)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var status = await loginProtection.CheckAsync(email, ip);
        return Ok(ApiResponse<LoginProtectionStatus>.Ok(status));
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

    [HttpPost("password-reset")]
    public async Task<ActionResult<ApiResponse<bool>>> RequestPasswordReset(PasswordResetRequest request)
    {
        await passwordResetService.RequestResetAsync(request.Email);
        // Always return success to prevent email enumeration
        return Ok(ApiResponse<bool>.Ok(true));
    }

    [HttpPost("password-reset/confirm")]
    public async Task<ActionResult<ApiResponse<bool>>> ConfirmPasswordReset(PasswordResetConfirmRequest request)
    {
        try
        {
            await passwordResetService.ConfirmResetAsync(request.Token, request.NewPassword);
            return Ok(ApiResponse<bool>.Ok(true));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<bool>.Fail(ex.Message));
        }
    }
}
