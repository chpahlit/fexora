using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("admin/compensation")]
[Authorize(Policy = "Admin")]
public class AdminCompensationController(ICompensationService compensationService) : ControllerBase
{
    [HttpGet("kpis")]
    public async Task<IActionResult> GetAllKpis()
    {
        var kpis = await compensationService.GetAllModeratorKpis();
        return Ok(ApiResponse<List<ModeratorKpiResponse>>.Ok(kpis));
    }

    [HttpGet("kpis/{moderatorId:guid}")]
    public async Task<IActionResult> GetModeratorKpis(Guid moderatorId)
    {
        var kpi = await compensationService.GetLiveKpis(moderatorId);
        return Ok(ApiResponse<ModeratorKpiResponse>.Ok(kpi));
    }

    [HttpGet("leaderboard")]
    public async Task<IActionResult> GetLeaderboard([FromQuery] int days = 7)
    {
        var from = DateTime.UtcNow.Date.AddDays(-days);
        var to = DateTime.UtcNow;
        var leaderboard = await compensationService.GetLeaderboard(from, to);
        return Ok(ApiResponse<List<TeamLeaderboardEntry>>.Ok(leaderboard));
    }

    [HttpPost("calculate/{moderatorId:guid}")]
    public async Task<IActionResult> Calculate(
        Guid moderatorId,
        [FromQuery] DateTime from,
        [FromQuery] DateTime to)
    {
        var report = await compensationService.CalculateCompensation(moderatorId, from, to);
        return Ok(ApiResponse<CompensationReportResponse>.Ok(report));
    }

    [HttpGet("reports")]
    public async Task<IActionResult> GetReports([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await compensationService.GetCompensationReports(page, pageSize);
        return Ok(ApiResponse<PaginatedResult<CompensationReportResponse>>.Ok(result));
    }
}
