using System.Security.Claims;
using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Wallet;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("wallet")]
[Authorize]
public class WalletController(IWalletService walletService) : ControllerBase
{
    [HttpGet("balance")]
    public async Task<ActionResult<ApiResponse<WalletResponse>>> GetBalance()
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await walletService.GetBalanceAsync(userId.Value);
        return Ok(ApiResponse<WalletResponse>.Ok(result));
    }

    [HttpGet("transactions")]
    public async Task<ActionResult<ApiResponse<PaginatedResult<TransactionResponse>>>> GetTransactions(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await walletService.GetTransactionsAsync(userId.Value, page, pageSize);
        return Ok(ApiResponse<PaginatedResult<TransactionResponse>>.Ok(result));
    }

    [HttpPost("topup")]
    public async Task<ActionResult<ApiResponse<TopupResponse>>> Topup(TopupRequest request)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        try
        {
            var result = await walletService.CreateTopupSessionAsync(userId.Value, request.PackId);
            return Ok(ApiResponse<TopupResponse>.Ok(result));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<TopupResponse>.Fail(ex.Message));
        }
    }

    [HttpPost("unlock")]
    public async Task<ActionResult<ApiResponse<UnlockResponse>>> Unlock(UnlockRequest request)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        try
        {
            var result = await walletService.UnlockContentAsync(userId.Value, request.ContentId);
            return Ok(ApiResponse<UnlockResponse>.Ok(result));
        }
        catch (Exception ex) when (ex is KeyNotFoundException or InvalidOperationException)
        {
            return BadRequest(ApiResponse<UnlockResponse>.Fail(ex.Message));
        }
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}
