using Fexora.Infrastructure.Services;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Fexora.Tests.Services;

public class LoginProtectionServiceTests
{
    private readonly LoginProtectionService _sut;
    private readonly IDistributedCache _cache;

    public LoginProtectionServiceTests()
    {
        _cache = new MemoryDistributedCache(
            Options.Create(new MemoryDistributedCacheOptions()));

        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Security:MaxLoginAttempts"] = "5",
                ["Security:LockoutMinutes"] = "15",
                ["Security:CaptchaAfterAttempts"] = "3",
            })
            .Build();

        _sut = new LoginProtectionService(_cache, config);
    }

    [Fact]
    public async Task Check_NoFailedAttempts_ReturnsUnlocked()
    {
        var status = await _sut.CheckAsync("user@fexora.de", "127.0.0.1");

        Assert.False(status.IsLocked);
        Assert.False(status.RequiresCaptcha);
        Assert.Equal(5, status.AttemptsRemaining);
    }

    [Fact]
    public async Task Check_AfterFailedAttempts_DecreasesRemaining()
    {
        await _sut.RecordFailedAttemptAsync("user@fexora.de", "127.0.0.1");
        await _sut.RecordFailedAttemptAsync("user@fexora.de", "127.0.0.1");

        var status = await _sut.CheckAsync("user@fexora.de", "127.0.0.1");

        Assert.False(status.IsLocked);
        Assert.Equal(3, status.AttemptsRemaining);
    }

    [Fact]
    public async Task Check_AfterCaptchaThreshold_RequiresCaptcha()
    {
        for (var i = 0; i < 3; i++)
            await _sut.RecordFailedAttemptAsync("user@fexora.de", "127.0.0.1");

        var status = await _sut.CheckAsync("user@fexora.de", "127.0.0.1");

        Assert.False(status.IsLocked);
        Assert.True(status.RequiresCaptcha);
        Assert.Equal(2, status.AttemptsRemaining);
    }

    [Fact]
    public async Task Check_AfterMaxAttempts_IsLocked()
    {
        for (var i = 0; i < 5; i++)
            await _sut.RecordFailedAttemptAsync("user@fexora.de", "127.0.0.1");

        var status = await _sut.CheckAsync("user@fexora.de", "127.0.0.1");

        Assert.True(status.IsLocked);
        Assert.True(status.RequiresCaptcha);
        Assert.Equal(0, status.AttemptsRemaining);
        Assert.Equal(15, status.LockoutMinutes);
    }

    [Fact]
    public async Task Reset_ClearsAttempts()
    {
        for (var i = 0; i < 4; i++)
            await _sut.RecordFailedAttemptAsync("user@fexora.de", "127.0.0.1");

        await _sut.ResetAsync("user@fexora.de", "127.0.0.1");

        var status = await _sut.CheckAsync("user@fexora.de", "127.0.0.1");
        Assert.False(status.IsLocked);
        Assert.False(status.RequiresCaptcha);
        Assert.Equal(5, status.AttemptsRemaining);
    }

    [Fact]
    public async Task Check_IpLockout_IndependentOfEmail()
    {
        // Lock out by IP using different emails
        for (var i = 0; i < 5; i++)
            await _sut.RecordFailedAttemptAsync($"user{i}@fexora.de", "127.0.0.1");

        // New email, same IP -> still locked
        var status = await _sut.CheckAsync("new@fexora.de", "127.0.0.1");
        Assert.True(status.IsLocked);
    }

    [Fact]
    public async Task Check_EmailNormalized_CaseInsensitive()
    {
        await _sut.RecordFailedAttemptAsync("USER@Fexora.DE", "127.0.0.1");

        var status = await _sut.CheckAsync("user@fexora.de", "127.0.0.1");

        Assert.Equal(4, status.AttemptsRemaining);
    }
}
