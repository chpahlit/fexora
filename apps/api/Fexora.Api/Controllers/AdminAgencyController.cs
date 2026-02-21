using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("admin/agencies")]
[Authorize(Policy = "Admin")]
public class AdminAgencyController(IAgencyService agencyService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var agencies = await agencyService.GetAll();
        return Ok(ApiResponse<List<AgencyResponse>>.Ok(agencies));
    }

    [HttpGet("{agencyId:guid}")]
    public async Task<IActionResult> GetById(Guid agencyId)
    {
        var agency = await agencyService.GetById(agencyId);
        if (agency == null) return NotFound(ApiResponse<object>.Fail("Agency not found"));
        return Ok(ApiResponse<AgencyResponse>.Ok(agency));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAgencyRequest request)
    {
        var id = await agencyService.Create(request);
        return Ok(ApiResponse<object>.Ok(new { id }));
    }

    [HttpPut("{agencyId:guid}")]
    public async Task<IActionResult> Update(Guid agencyId, [FromBody] UpdateAgencyRequest request)
    {
        var success = await agencyService.Update(agencyId, request);
        if (!success) return NotFound(ApiResponse<object>.Fail("Agency not found"));
        return Ok(ApiResponse<object>.Ok(new { success = true }));
    }

    [HttpGet("{agencyId:guid}/moderators")]
    public async Task<IActionResult> GetModerators(Guid agencyId)
    {
        var moderators = await agencyService.GetModerators(agencyId);
        return Ok(ApiResponse<List<AgencyModeratorResponse>>.Ok(moderators));
    }

    [HttpPost("{agencyId:guid}/moderators")]
    public async Task<IActionResult> AddModerator(Guid agencyId, [FromBody] AddAgencyModeratorRequest request)
    {
        var success = await agencyService.AddModerator(agencyId, request);
        if (!success) return BadRequest(ApiResponse<object>.Fail("Moderator already in agency"));
        return Ok(ApiResponse<object>.Ok(new { success = true }));
    }

    [HttpDelete("{agencyId:guid}/moderators/{moderatorId:guid}")]
    public async Task<IActionResult> RemoveModerator(Guid agencyId, Guid moderatorId)
    {
        var success = await agencyService.RemoveModerator(agencyId, moderatorId);
        if (!success) return NotFound(ApiResponse<object>.Fail("Moderator not found in agency"));
        return Ok(ApiResponse<object>.Ok(new { success = true }));
    }
}
