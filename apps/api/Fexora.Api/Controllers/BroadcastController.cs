using Fexora.Core.DTOs;
using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("broadcasts")]
[Authorize(Policy = "Admin")]
public class BroadcastController(IBroadcastService broadcastService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<Broadcast>>> Create([FromBody] CreateBroadcastRequest request)
    {
        var broadcast = await broadcastService.CreateAsync(
            request.Name, request.TargetingQueryJson, request.SenderProfileId, request.IsDryRun);
        return Ok(ApiResponse<Broadcast>.Ok(broadcast));
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResult<Broadcast>>>> List(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await broadcastService.ListAsync(page, pageSize);
        return Ok(ApiResponse<PaginatedResult<Broadcast>>.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<Broadcast>>> Get(Guid id)
    {
        var broadcast = await broadcastService.GetAsync(id);
        if (broadcast is null) return NotFound(ApiResponse<Broadcast>.Fail("Not found."));
        return Ok(ApiResponse<Broadcast>.Ok(broadcast));
    }

    [HttpPost("{id:guid}/variants")]
    public async Task<ActionResult<ApiResponse<bool>>> AddVariant(Guid id, [FromBody] AddVariantRequest request)
    {
        try
        {
            await broadcastService.AddVariantAsync(id, request.TemplateId, request.VariantName, request.WeightPercent);
            return Ok(ApiResponse<bool>.Ok(true));
        }
        catch (ArgumentException ex) { return BadRequest(ApiResponse<bool>.Fail(ex.Message)); }
    }

    [HttpPost("{id:guid}/schedule")]
    public async Task<ActionResult<ApiResponse<bool>>> Schedule(Guid id, [FromBody] ScheduleBroadcastRequest request)
    {
        try
        {
            await broadcastService.ScheduleAsync(id, request.ScheduledAt);
            return Ok(ApiResponse<bool>.Ok(true));
        }
        catch (Exception ex) when (ex is ArgumentException or InvalidOperationException)
        {
            return BadRequest(ApiResponse<bool>.Fail(ex.Message));
        }
    }

    [HttpPost("{id:guid}/abort")]
    public async Task<ActionResult<ApiResponse<bool>>> Abort(Guid id)
    {
        try
        {
            await broadcastService.AbortAsync(id);
            return Ok(ApiResponse<bool>.Ok(true));
        }
        catch (ArgumentException ex) { return BadRequest(ApiResponse<bool>.Fail(ex.Message)); }
    }

    [HttpGet("{id:guid}/winner")]
    public async Task<ActionResult<ApiResponse<BroadcastVariant>>> GetWinner(Guid id)
    {
        var winner = await broadcastService.GetWinnerAsync(id);
        if (winner is null) return NotFound(ApiResponse<BroadcastVariant>.Fail("No variants."));
        return Ok(ApiResponse<BroadcastVariant>.Ok(winner));
    }
}

public record CreateBroadcastRequest(string Name, string TargetingQueryJson, Guid SenderProfileId, bool IsDryRun = false);
public record AddVariantRequest(Guid TemplateId, string VariantName, int WeightPercent = 100);
public record ScheduleBroadcastRequest(DateTime? ScheduledAt);
