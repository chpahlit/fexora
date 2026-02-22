using System.Text.Json;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class TargetingService(FexoraDbContext db) : ITargetingService
{
    public async Task<int> PreviewSegmentSizeAsync(string queryJson)
    {
        var userIds = await GetSegmentUserIdsAsync(queryJson);
        return userIds.Count;
    }

    public async Task<List<Guid>> GetSegmentUserIdsAsync(string queryJson, int? limit = null)
    {
        var filters = JsonSerializer.Deserialize<SegmentQuery>(queryJson, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        }) ?? new SegmentQuery();

        var query = db.Users.Where(u => u.IsActive);
        var now = DateTime.UtcNow;

        // Registration date filters
        if (filters.RegisteredAfterDays.HasValue)
        {
            var cutoff = now.AddDays(-filters.RegisteredAfterDays.Value);
            query = query.Where(u => u.CreatedAt >= cutoff);
        }
        if (filters.RegisteredBeforeDays.HasValue)
        {
            var cutoff = now.AddDays(-filters.RegisteredBeforeDays.Value);
            query = query.Where(u => u.CreatedAt <= cutoff);
        }

        // Role filter
        if (filters.Role is not null)
        {
            query = query.Where(u => u.Role.ToString() == filters.Role);
        }

        // Has purchased filter
        if (filters.HasPurchased == true)
        {
            query = query.Where(u => db.Purchases.Any(p => p.BuyerId == u.Id));
        }
        else if (filters.HasPurchased == false)
        {
            query = query.Where(u => !db.Purchases.Any(p => p.BuyerId == u.Id));
        }

        // Has subscription filter
        if (filters.HasSubscription == true)
        {
            query = query.Where(u => db.Subscriptions.Any(s => s.UserId == u.Id && s.Status.ToString() == "Active"));
        }
        else if (filters.HasSubscription == false)
        {
            query = query.Where(u => !db.Subscriptions.Any(s => s.UserId == u.Id && s.Status.ToString() == "Active"));
        }

        // Coin balance filters
        if (filters.MinCoinBalance.HasValue)
        {
            query = query.Where(u => db.CreditWallets.Any(w => w.UserId == u.Id && w.Balance >= filters.MinCoinBalance.Value));
        }
        if (filters.MaxCoinBalance.HasValue)
        {
            query = query.Where(u => db.CreditWallets.Any(w => w.UserId == u.Id && w.Balance <= filters.MaxCoinBalance.Value));
        }

        // Follows specific creator
        if (filters.FollowsCreatorId.HasValue)
        {
            query = query.Where(u => db.Follows.Any(f => f.FollowerId == u.Id && f.FolloweeId == filters.FollowsCreatorId.Value));
        }

        var result = query.Select(u => u.Id);

        if (limit.HasValue)
            result = result.Take(limit.Value);

        return await result.ToListAsync();
    }

    private class SegmentQuery
    {
        public int? RegisteredAfterDays { get; set; }
        public int? RegisteredBeforeDays { get; set; }
        public string? Role { get; set; }
        public bool? HasPurchased { get; set; }
        public bool? HasSubscription { get; set; }
        public int? MinCoinBalance { get; set; }
        public int? MaxCoinBalance { get; set; }
        public Guid? FollowsCreatorId { get; set; }
    }
}
