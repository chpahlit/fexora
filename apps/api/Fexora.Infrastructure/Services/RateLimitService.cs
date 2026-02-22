using System.Text.Json;
using Fexora.Core.Interfaces;
using Microsoft.Extensions.Caching.Distributed;

namespace Fexora.Infrastructure.Services;

public class RateLimitService(IDistributedCache cache) : IRateLimitService
{
    private const int DefaultMaxActionsPerDay = 10;
    private const int GlobalMaxActionsPerHour = 1000;

    public async Task<bool> CanExecuteAsync(Guid userId, string? rateLimitConfigJson)
    {
        var maxPerDay = DefaultMaxActionsPerDay;
        if (rateLimitConfigJson is not null)
        {
            try
            {
                var config = JsonSerializer.Deserialize<RateLimitConfig>(rateLimitConfigJson,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (config?.MaxPerDay > 0) maxPerDay = config.MaxPerDay;
            }
            catch { /* use default */ }
        }

        var key = $"orchestrator:ratelimit:user:{userId}:{DateTime.UtcNow:yyyyMMdd}";
        var countStr = await cache.GetStringAsync(key);
        var count = countStr is not null ? int.Parse(countStr) : 0;

        return count < maxPerDay;
    }

    public async Task IncrementAsync(Guid userId)
    {
        var key = $"orchestrator:ratelimit:user:{userId}:{DateTime.UtcNow:yyyyMMdd}";
        var countStr = await cache.GetStringAsync(key);
        var count = countStr is not null ? int.Parse(countStr) : 0;
        count++;

        await cache.SetStringAsync(key, count.ToString(), new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(25)
        });
    }

    public Task<bool> IsQuietHoursAsync()
    {
        // Quiet hours: 23:00 - 08:00 CET
        var cetZone = TimeZoneInfo.FindSystemTimeZoneById("Central European Standard Time");
        var cetNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, cetZone);
        var isQuiet = cetNow.Hour >= 23 || cetNow.Hour < 8;
        return Task.FromResult(isQuiet);
    }

    public async Task<bool> IsGlobalLimitReachedAsync()
    {
        var key = $"orchestrator:ratelimit:global:{DateTime.UtcNow:yyyyMMddHH}";
        var countStr = await cache.GetStringAsync(key);
        var count = countStr is not null ? int.Parse(countStr) : 0;
        return count >= GlobalMaxActionsPerHour;
    }

    public async Task IncrementGlobalAsync()
    {
        var key = $"orchestrator:ratelimit:global:{DateTime.UtcNow:yyyyMMddHH}";
        var countStr = await cache.GetStringAsync(key);
        var count = countStr is not null ? int.Parse(countStr) : 0;
        count++;

        await cache.SetStringAsync(key, count.ToString(), new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(2)
        });
    }

    private class RateLimitConfig
    {
        public int MaxPerDay { get; set; }
    }
}
