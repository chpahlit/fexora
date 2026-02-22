using System.Security.Claims;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class PushController(IPushService pushService) : ControllerBase
{
    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeRequest req)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await pushService.SubscribeAsync(userId, req.Endpoint, req.P256dh, req.Auth, req.UserAgent);
        return Ok();
    }

    [HttpPost("unsubscribe")]
    public async Task<IActionResult> Unsubscribe([FromBody] UnsubscribeRequest req)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await pushService.UnsubscribeAsync(userId, req.Endpoint);
        return Ok();
    }
}

public record SubscribeRequest(string Endpoint, string P256dh, string Auth, string? UserAgent);
public record UnsubscribeRequest(string Endpoint);
