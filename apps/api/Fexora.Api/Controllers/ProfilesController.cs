using System.Security.Claims;
using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Profile;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("profiles")]
public class ProfilesController(IProfileService profileService) : ControllerBase
{
    [HttpGet("{username}")]
    public async Task<ActionResult<ApiResponse<ProfileResponse>>> GetByUsername(string username)
    {
        var profile = await profileService.GetByUsernameAsync(username);
        if (profile is null)
            return NotFound(ApiResponse<ProfileResponse>.Fail("Profil nicht gefunden."));

        return Ok(ApiResponse<ProfileResponse>.Ok(profile));
    }

    [Authorize]
    [HttpPatch("me")]
    public async Task<ActionResult<ApiResponse<ProfileResponse>>> Update(UpdateProfileRequest request)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        try
        {
            var result = await profileService.UpdateAsync(userId.Value, request);
            return Ok(ApiResponse<ProfileResponse>.Ok(result));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<ProfileResponse>.Fail(ex.Message));
        }
    }

    [Authorize]
    [HttpPost("me/avatar")]
    public async Task<ActionResult<ApiResponse<string>>> UploadAvatar(IFormFile file)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        if (file.Length == 0 || file.Length > 20 * 1024 * 1024)
            return BadRequest(ApiResponse<string>.Fail("Datei muss zwischen 1 Byte und 20 MB groß sein."));

        var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
        if (!allowedTypes.Contains(file.ContentType))
            return BadRequest(ApiResponse<string>.Fail("Nur JPEG, PNG und WebP erlaubt."));

        using var stream = file.OpenReadStream();
        var url = await profileService.UpdateAvatarAsync(userId.Value, stream, file.FileName, file.ContentType);
        return Ok(ApiResponse<string>.Ok(url));
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}
