using System.Security.Claims;
using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Content;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("content")]
public class ContentController(IContentService contentService) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ContentResponse>>> Create(CreateContentRequest request)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        try
        {
            var result = await contentService.CreateAsync(userId.Value, request);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponse<ContentResponse>.Ok(result));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<ContentResponse>.Fail(ex.Message));
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ContentResponse>>> GetById(Guid id)
    {
        var content = await contentService.GetByIdAsync(id);
        if (content is null)
            return NotFound(ApiResponse<ContentResponse>.Fail("Content nicht gefunden."));

        return Ok(ApiResponse<ContentResponse>.Ok(content));
    }

    [Authorize]
    [HttpPost("{id:guid}/media")]
    public async Task<ActionResult<ApiResponse<ContentResponse>>> UploadMedia(Guid id, IFormFile file)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        if (file.Length == 0 || file.Length > 500 * 1024 * 1024)
            return BadRequest(ApiResponse<ContentResponse>.Fail("Datei muss zwischen 1 Byte und 500 MB groß sein."));

        try
        {
            using var stream = file.OpenReadStream();
            var result = await contentService.UploadMediaAsync(id, userId.Value, stream, file.FileName, file.ContentType);
            return Ok(ApiResponse<ContentResponse>.Ok(result));
        }
        catch (Exception ex) when (ex is KeyNotFoundException or UnauthorizedAccessException or InvalidOperationException)
        {
            return BadRequest(ApiResponse<ContentResponse>.Fail(ex.Message));
        }
    }

    [Authorize]
    [HttpPost("{id:guid}/submit")]
    public async Task<ActionResult<ApiResponse<ContentResponse>>> Submit(Guid id)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        try
        {
            var result = await contentService.SubmitForReviewAsync(id, userId.Value);
            return Ok(ApiResponse<ContentResponse>.Ok(result));
        }
        catch (Exception ex) when (ex is KeyNotFoundException or UnauthorizedAccessException or InvalidOperationException)
        {
            return BadRequest(ApiResponse<ContentResponse>.Fail(ex.Message));
        }
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<ActionResult<ApiResponse<PaginatedResult<ContentResponse>>>> GetMy(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await contentService.GetByOwnerAsync(userId.Value, page, pageSize);
        return Ok(ApiResponse<PaginatedResult<ContentResponse>>.Ok(result));
    }

    [HttpGet("feed")]
    public async Task<ActionResult<ApiResponse<PaginatedResult<ContentResponse>>>> Feed(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await contentService.GetApprovedFeedAsync(page, pageSize);
        return Ok(ApiResponse<PaginatedResult<ContentResponse>>.Ok(result));
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}
