using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Wallet;

namespace Fexora.Core.Interfaces;

public interface IWalletService
{
    Task<WalletResponse> GetBalanceAsync(Guid userId);
    Task<PaginatedResult<TransactionResponse>> GetTransactionsAsync(Guid userId, int page, int pageSize);
    Task<TopupResponse> CreateTopupSessionAsync(Guid userId, string packId);
    Task HandleStripeWebhookAsync(string json, string signature);
    Task<UnlockResponse> UnlockContentAsync(Guid buyerId, Guid contentId);
}
