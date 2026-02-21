using System.Security.Claims;
using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("admin/payouts")]
[Authorize(Policy = "Admin")]
public class AdminPayoutsController(IPayoutService payoutService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetPayouts(
        [FromQuery] string? status,
        [FromQuery] Guid? userId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await payoutService.GetPayouts(status, userId, page, pageSize);
        return Ok(ApiResponse<PaginatedResult<PayoutResponse>>.Ok(result));
    }

    [HttpPost]
    public async Task<IActionResult> CreatePayout([FromBody] CreatePayoutRequest request)
    {
        var actorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var id = await payoutService.CreatePayout(request, actorId);
        return Ok(ApiResponse<object>.Ok(new { id }));
    }

    [HttpPut("{payoutId:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid payoutId, [FromBody] UpdatePayoutStatusRequest request)
    {
        var actorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var success = await payoutService.UpdatePayoutStatus(payoutId, request, actorId);
        if (!success) return BadRequest(ApiResponse<object>.Fail("Invalid status or payout not found"));
        return Ok(ApiResponse<object>.Ok(new { success = true }));
    }
}
