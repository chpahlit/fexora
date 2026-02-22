using System.Security.Claims;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class SocialAuthController(ISocialAuthService socialAuthService) : ControllerBase
{
    [HttpPost("google")]
    public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginRequest req)
    {
        var (user, accessToken, refreshToken) = await socialAuthService.LoginWithGoogleAsync(req.IdToken);
        return Ok(new { user.Id, user.Email, accessToken, refreshToken });
    }

    [HttpPost("apple")]
    public async Task<IActionResult> LoginWithApple([FromBody] AppleLoginRequest req)
    {
        var (user, accessToken, refreshToken) = await socialAuthService.LoginWithAppleAsync(req.IdToken, req.Name);
        return Ok(new { user.Id, user.Email, accessToken, refreshToken });
    }

    [Authorize]
    [HttpPost("link")]
    public async Task<IActionResult> LinkSocial([FromBody] LinkSocialRequest req)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await socialAuthService.LinkSocialAsync(userId, req.Provider, req.ProviderUserId, req.Email);
        return Ok();
    }

    [Authorize]
    [HttpDelete("link/{provider}")]
    public async Task<IActionResult> UnlinkSocial(string provider)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await socialAuthService.UnlinkSocialAsync(userId, provider);
        return Ok();
    }
}

public record GoogleLoginRequest(string IdToken);
public record AppleLoginRequest(string IdToken, string? Name);
public record LinkSocialRequest(string Provider, string ProviderUserId, string? Email);
