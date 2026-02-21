using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;

namespace Fexora.Core.Interfaces;

public interface IPayoutService
{
    Task<Guid> CreatePayout(CreatePayoutRequest request, Guid actorId);
    Task<PaginatedResult<PayoutResponse>> GetPayouts(string? status, Guid? userId, int page, int pageSize);
    Task<bool> UpdatePayoutStatus(Guid payoutId, UpdatePayoutStatusRequest request, Guid actorId);
}
