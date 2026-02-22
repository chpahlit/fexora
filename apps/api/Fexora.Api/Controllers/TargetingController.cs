using Fexora.Core.DTOs;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("segments")]
[Authorize(Policy = "Admin")]
public class TargetingController(ITargetingService targetingService) : ControllerBase
{
    [HttpPost("preview")]
    public async Task<ActionResult<ApiResponse<int>>> Preview([FromBody] SegmentQueryRequest request)
    {
        try
        {
            var count = await targetingService.PreviewSegmentSizeAsync(request.QueryJson);
            return Ok(ApiResponse<int>.Ok(count));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<int>.Fail(ex.Message));
        }
    }

    [HttpPost("users")]
    public async Task<ActionResult<ApiResponse<List<Guid>>>> GetUsers([FromBody] SegmentQueryRequest request)
    {
        try
        {
            var userIds = await targetingService.GetSegmentUserIdsAsync(request.QueryJson, request.Limit);
            return Ok(ApiResponse<List<Guid>>.Ok(userIds));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<List<Guid>>.Fail(ex.Message));
        }
    }
}

public record SegmentQueryRequest(string QueryJson, int? Limit);
