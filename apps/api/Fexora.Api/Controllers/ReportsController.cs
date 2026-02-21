using System.Security.Claims;
using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("reports")]
public class ReportsController(IReportService reportService) : ControllerBase
{
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateReport([FromBody] CreateReportRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var id = await reportService.CreateReport(userId, request);
        return Ok(ApiResponse<object>.Ok(new { id }));
    }

    [HttpGet]
    [Authorize(Policy = "Moderator")]
    public async Task<IActionResult> GetReports(
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await reportService.GetReports(status, page, pageSize);
        return Ok(ApiResponse<PaginatedResult<ReportResponse>>.Ok(result));
    }

    [HttpGet("{reportId:guid}")]
    [Authorize(Policy = "Moderator")]
    public async Task<IActionResult> GetReport(Guid reportId)
    {
        var report = await reportService.GetReportById(reportId);
        if (report == null) return NotFound(ApiResponse<object>.Fail("Report not found"));
        return Ok(ApiResponse<ReportResponse>.Ok(report));
    }

    [HttpPost("{reportId:guid}/resolve")]
    [Authorize(Policy = "Moderator")]
    public async Task<IActionResult> ResolveReport(Guid reportId, [FromBody] ResolveReportRequest request)
    {
        var reviewerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var success = await reportService.ResolveReport(reportId, reviewerId, request);
        if (!success) return BadRequest(ApiResponse<object>.Fail("Invalid status or report not found"));
        return Ok(ApiResponse<object>.Ok(new { success = true }));
    }
}
