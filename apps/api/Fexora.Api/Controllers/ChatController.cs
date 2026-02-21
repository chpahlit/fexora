using System.Security.Claims;
using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Chat;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("messages")]
[Authorize]
public class ChatController(IChatService chatService) : ControllerBase
{
    [HttpGet("threads")]
    public async Task<ActionResult<ApiResponse<List<ThreadResponse>>>> GetThreads()
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await chatService.GetThreadsAsync(userId.Value);
        return Ok(ApiResponse<List<ThreadResponse>>.Ok(result));
    }

    [HttpGet("threads/{threadId:guid}")]
    public async Task<ActionResult<ApiResponse<PaginatedResult<MessageResponse>>>> GetMessages(
        Guid threadId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        try
        {
            var result = await chatService.GetMessagesAsync(userId.Value, threadId, page, pageSize);
            return Ok(ApiResponse<PaginatedResult<MessageResponse>>.Ok(result));
        }
        catch (Exception ex) when (ex is KeyNotFoundException or UnauthorizedAccessException)
        {
            return BadRequest(ApiResponse<PaginatedResult<MessageResponse>>.Fail(ex.Message));
        }
    }

    [HttpPost("send")]
    public async Task<ActionResult<ApiResponse<MessageResponse>>> Send(SendMessageRequest request)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await chatService.SendMessageAsync(userId.Value, request);
        return Ok(ApiResponse<MessageResponse>.Ok(result));
    }

    [HttpPost("threads/{threadId:guid}/read")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAsRead(Guid threadId)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        await chatService.MarkAsReadAsync(userId.Value, threadId);
        return Ok(ApiResponse<bool>.Ok(true));
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}
