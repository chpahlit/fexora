using Fexora.Core.DTOs;
using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("dmca")]
public class DmcaController(IDmcaService dmcaService) : ControllerBase
{
    [Authorize]
    [HttpPost("report")]
    public async Task<ActionResult<ApiResponse<DmcaReport>>> CreateReport([FromBody] CreateDmcaRequest request)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            var report = await dmcaService.CreateReportAsync(userId, request.ContentId, request.OriginalUrl, request.Description, request.EvidenceUrlsJson);
            return Ok(ApiResponse<DmcaReport>.Ok(report));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<DmcaReport>.Fail(ex.Message));
        }
    }

    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<DmcaReport>>> GetReport(Guid id)
    {
        var report = await dmcaService.GetReportAsync(id);
        if (report is null)
            return NotFound(ApiResponse<DmcaReport>.Fail("Report nicht gefunden."));
        return Ok(ApiResponse<DmcaReport>.Ok(report));
    }

    [Authorize(Policy = "Admin")]
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResult<DmcaReport>>>> GetReports(
        [FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await dmcaService.GetReportsAsync(status, page, pageSize);
        return Ok(ApiResponse<PaginatedResult<DmcaReport>>.Ok(result));
    }

    [Authorize(Policy = "Admin")]
    [HttpPost("{id:guid}/review")]
    public async Task<ActionResult<ApiResponse<bool>>> ReviewReport(Guid id, [FromBody] ReviewDmcaRequest request)
    {
        try
        {
            var reviewerId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            await dmcaService.ReviewReportAsync(id, reviewerId, request.Approve, request.Comment);
            return Ok(ApiResponse<bool>.Ok(true));
        }
        catch (Exception ex) when (ex is ArgumentException or InvalidOperationException)
        {
            return BadRequest(ApiResponse<bool>.Fail(ex.Message));
        }
    }
}

public record CreateDmcaRequest(string ContentId, string OriginalUrl, string Description, string? EvidenceUrlsJson);
public record ReviewDmcaRequest(bool Approve, string? Comment);
