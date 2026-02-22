using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;

namespace Fexora.Infrastructure.Services;

public class LoginProtectionService(IDistributedCache cache, IConfiguration config)
{
    private int MaxAttempts => config.GetValue("Security:MaxLoginAttempts", 5);
    private int LockoutMinutes => config.GetValue("Security:LockoutMinutes", 15);
    private int CaptchaThreshold => config.GetValue("Security:CaptchaAfterAttempts", 3);

    public async Task<LoginProtectionStatus> CheckAsync(string email, string ipAddress)
    {
        var emailKey = $"login:fail:email:{email.ToLowerInvariant()}";
        var ipKey = $"login:fail:ip:{ipAddress}";

        var emailAttempts = await GetAttemptsAsync(emailKey);
        var ipAttempts = await GetAttemptsAsync(ipKey);
        var maxAttempts = Math.Max(emailAttempts, ipAttempts);

        if (maxAttempts >= MaxAttempts)
        {
            return new LoginProtectionStatus
            {
                IsLocked = true,
                RequiresCaptcha = true,
                AttemptsRemaining = 0,
                LockoutMinutes = LockoutMinutes
            };
        }

        return new LoginProtectionStatus
        {
            IsLocked = false,
            RequiresCaptcha = maxAttempts >= CaptchaThreshold,
            AttemptsRemaining = MaxAttempts - maxAttempts
        };
    }

    public async Task RecordFailedAttemptAsync(string email, string ipAddress)
    {
        var emailKey = $"login:fail:email:{email.ToLowerInvariant()}";
        var ipKey = $"login:fail:ip:{ipAddress}";
        var ttl = TimeSpan.FromMinutes(LockoutMinutes);

        await IncrementAsync(emailKey, ttl);
        await IncrementAsync(ipKey, ttl);
    }

    public async Task ResetAsync(string email, string ipAddress)
    {
        var emailKey = $"login:fail:email:{email.ToLowerInvariant()}";
        var ipKey = $"login:fail:ip:{ipAddress}";

        await cache.RemoveAsync(emailKey);
        await cache.RemoveAsync(ipKey);
    }

    private async Task<int> GetAttemptsAsync(string key)
    {
        var val = await cache.GetStringAsync(key);
        return val is not null ? int.Parse(val) : 0;
    }

    private async Task IncrementAsync(string key, TimeSpan ttl)
    {
        var current = await GetAttemptsAsync(key);
        await cache.SetStringAsync(key, (current + 1).ToString(), new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = ttl
        });
    }
}

public class LoginProtectionStatus
{
    public bool IsLocked { get; set; }
    public bool RequiresCaptcha { get; set; }
    public int AttemptsRemaining { get; set; }
    public int LockoutMinutes { get; set; }
}
