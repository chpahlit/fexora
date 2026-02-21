using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("webhooks")]
public class StripeWebhookController(IWalletService walletService) : ControllerBase
{
    [HttpPost("stripe")]
    public async Task<IActionResult> HandleStripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var signature = Request.Headers["Stripe-Signature"].ToString();

        try
        {
            await walletService.HandleStripeWebhookAsync(json, signature);
            return Ok();
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }
}
