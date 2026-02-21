using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Content;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("admin")]
[Authorize(Policy = "Moderator")]
public class AdminController(IContentService contentService) : ControllerBase
{
    [HttpGet("review")]
    public async Task<ActionResult<ApiResponse<PaginatedResult<ContentResponse>>>> GetPendingReview(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await contentService.GetPendingAsync(page, pageSize);
        return Ok(ApiResponse<PaginatedResult<ContentResponse>>.Ok(result));
    }

    [HttpPost("content/{id:guid}/review")]
    public async Task<ActionResult<ApiResponse<ContentResponse>>> ReviewContent(Guid id, ReviewContentRequest request)
    {
        try
        {
            var result = await contentService.ReviewAsync(id, request);
            return Ok(ApiResponse<ContentResponse>.Ok(result));
        }
        catch (Exception ex) when (ex is KeyNotFoundException or InvalidOperationException)
        {
            return BadRequest(ApiResponse<ContentResponse>.Fail(ex.Message));
        }
    }
}
