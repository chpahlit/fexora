using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("admin/analytics")]
[Authorize(Policy = "Admin")]
public class AdminAnalyticsController(IAnalyticsService analyticsService) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var stats = await analyticsService.GetDashboardStats();
        return Ok(ApiResponse<DashboardStats>.Ok(stats));
    }

    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenue([FromQuery] int days = 30)
    {
        var data = await analyticsService.GetRevenueHistory(days);
        return Ok(ApiResponse<List<RevenueDataPoint>>.Ok(data));
    }

    [HttpGet("content")]
    public async Task<IActionResult> GetContentStats()
    {
        var stats = await analyticsService.GetContentStats();
        return Ok(ApiResponse<ContentStats>.Ok(stats));
    }
}
