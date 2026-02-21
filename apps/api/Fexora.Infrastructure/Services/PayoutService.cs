using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;
using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class PayoutService(FexoraDbContext db, IAuditService audit) : IPayoutService
{
    public async Task<Guid> CreatePayout(CreatePayoutRequest request, Guid actorId)
    {
        var payout = new PayoutRecord
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Amount = request.Amount,
            Note = request.Note,
            PeriodStart = request.PeriodStart,
            PeriodEnd = request.PeriodEnd,
            CreatedAt = DateTime.UtcNow,
        };

        db.PayoutRecords.Add(payout);
        await db.SaveChangesAsync();

        await audit.Log(actorId, "CreatePayout", "Payout", payout.Id, $"Amount: {request.Amount} EUR for user {request.UserId}", null);
        return payout.Id;
    }

    public async Task<PaginatedResult<PayoutResponse>> GetPayouts(string? status, Guid? userId, int page, int pageSize)
    {
        var query = db.PayoutRecords.Include(p => p.User).ThenInclude(u => u.Profile).AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<PayoutStatus>(status, true, out var statusEnum))
            query = query.Where(p => p.Status == statusEnum);

        if (userId.HasValue)
            query = query.Where(p => p.UserId == userId.Value);

        var total = await query.CountAsync();
        var payouts = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new PayoutResponse
            {
                Id = p.Id,
                UserId = p.UserId,
                Username = p.User.Profile != null ? p.User.Profile.Username : p.User.Email,
                Amount = p.Amount,
                Currency = p.Currency,
                Status = p.Status.ToString(),
                Note = p.Note,
                PeriodStart = p.PeriodStart,
                PeriodEnd = p.PeriodEnd,
                CreatedAt = p.CreatedAt,
                CompletedAt = p.CompletedAt,
            })
            .ToListAsync();

        return new PaginatedResult<PayoutResponse> { Data = payouts, Total = total, Page = page, PageSize = pageSize };
    }

    public async Task<bool> UpdatePayoutStatus(Guid payoutId, UpdatePayoutStatusRequest request, Guid actorId)
    {
        if (!Enum.TryParse<PayoutStatus>(request.Status, true, out var status)) return false;

        var payout = await db.PayoutRecords.FindAsync(payoutId);
        if (payout == null) return false;

        var oldStatus = payout.Status;
        payout.Status = status;
        payout.GatewayRef = request.GatewayRef ?? payout.GatewayRef;

        if (status == PayoutStatus.Completed)
            payout.CompletedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        await audit.Log(actorId, "UpdatePayoutStatus", "Payout", payoutId, $"{oldStatus} -> {status}", null);
        return true;
    }
}
