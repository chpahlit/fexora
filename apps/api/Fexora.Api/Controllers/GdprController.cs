using System.Security.Claims;
using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Gdpr;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("gdpr")]
[Authorize]
public class GdprController(IGdprService gdprService) : ControllerBase
{
    [HttpPut("consent")]
    public async Task<IActionResult> UpdateConsent([FromBody] ConsentRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await gdprService.UpdateConsent(userId, request);
        return Ok(ApiResponse<object>.Ok(new { success = true }));
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportData()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var data = await gdprService.ExportData(userId);
        return Ok(ApiResponse<DataExportResponse>.Ok(data));
    }

    [HttpPost("delete")]
    public async Task<IActionResult> RequestDeletion()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await gdprService.RequestDataDeletion(userId);
        return Ok(ApiResponse<object>.Ok(new { success = true, message = "Löschantrag wurde eingereicht." }));
    }
}
