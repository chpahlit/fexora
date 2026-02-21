using System.Security.Claims;
using Fexora.Core.DTOs;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("watermark")]
[Authorize]
public class WatermarkController(IWatermarkService watermarkService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> ApplyWatermark(IFormFile file, [FromQuery] string? text)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var watermarkText = text ?? $"Fexora - {userId[..8]}";

        using var stream = file.OpenReadStream();
        var result = await watermarkService.ApplyWatermark(stream, watermarkText);

        return File(result, "image/png", $"watermarked_{file.FileName}");
    }
}
