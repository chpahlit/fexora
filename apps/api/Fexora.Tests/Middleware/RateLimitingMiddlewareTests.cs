using System.Net;
using Fexora.Api.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Fexora.Tests.Middleware;

public class RateLimitingMiddlewareTests
{
    private readonly IDistributedCache _cache;
    private readonly IConfiguration _config;

    public RateLimitingMiddlewareTests()
    {
        _cache = new MemoryDistributedCache(
            Options.Create(new MemoryDistributedCacheOptions()));

        _config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["RateLimiting:GlobalRpm"] = "120",
                ["RateLimiting:AuthenticatedRpm"] = "60",
                ["RateLimiting:AnonymousRpm"] = "3",
                ["RateLimiting:AuthEndpointRpm"] = "2",
            })
            .Build();
    }

    private RateLimitingMiddleware CreateMiddleware(RequestDelegate? next = null)
    {
        return new RateLimitingMiddleware(
            next ?? (_ => Task.CompletedTask),
            _cache,
            _config);
    }

    private static DefaultHttpContext CreateContext(string path = "/api/test")
    {
        var context = new DefaultHttpContext();
        context.Request.Path = path;
        context.Response.Body = new MemoryStream();
        context.Connection.RemoteIpAddress = System.Net.IPAddress.Parse("127.0.0.1");
        return context;
    }

    [Fact]
    public async Task NormalRequest_PassesThrough()
    {
        var nextCalled = false;
        var middleware = new RateLimitingMiddleware(
            _ => { nextCalled = true; return Task.CompletedTask; },
            _cache, _config);

        var context = CreateContext();
        await middleware.InvokeAsync(context);

        Assert.True(nextCalled);
    }

    [Fact]
    public async Task SetsRateLimitHeaders()
    {
        var middleware = CreateMiddleware();
        var context = CreateContext();

        await middleware.InvokeAsync(context);

        Assert.True(context.Response.Headers.ContainsKey("X-RateLimit-Limit"));
        Assert.True(context.Response.Headers.ContainsKey("X-RateLimit-Remaining"));
    }

    [Fact]
    public async Task HealthEndpoint_SkipsRateLimit()
    {
        var middleware = CreateMiddleware();

        // Send many requests to health endpoint
        for (var i = 0; i < 10; i++)
        {
            var context = CreateContext("/health");
            await middleware.InvokeAsync(context);
            Assert.NotEqual((int)HttpStatusCode.TooManyRequests, context.Response.StatusCode);
        }
    }

    [Fact]
    public async Task OpenApiEndpoint_SkipsRateLimit()
    {
        var middleware = CreateMiddleware();

        for (var i = 0; i < 10; i++)
        {
            var context = CreateContext("/openapi");
            await middleware.InvokeAsync(context);
            Assert.NotEqual((int)HttpStatusCode.TooManyRequests, context.Response.StatusCode);
        }
    }

    [Fact]
    public async Task ExceedingLimit_Returns429()
    {
        var middleware = CreateMiddleware();

        // AnonymousRpm is set to 3 for testing
        for (var i = 0; i < 3; i++)
        {
            var context = CreateContext();
            await middleware.InvokeAsync(context);
        }

        // 4th request should be rate limited
        var limitedContext = CreateContext();
        await middleware.InvokeAsync(limitedContext);

        Assert.Equal((int)HttpStatusCode.TooManyRequests, limitedContext.Response.StatusCode);
        Assert.Equal("60", limitedContext.Response.Headers["Retry-After"]);
    }

    [Fact]
    public async Task AuthEndpoints_HaveStricterLimits()
    {
        var middleware = CreateMiddleware();

        // AuthEndpointRpm is 2
        for (var i = 0; i < 2; i++)
        {
            var context = CreateContext("/auth/login");
            await middleware.InvokeAsync(context);
        }

        var limitedContext = CreateContext("/auth/login");
        limitedContext.Response.Body = new MemoryStream();
        limitedContext.Connection.RemoteIpAddress = System.Net.IPAddress.Parse("127.0.0.1");
        await middleware.InvokeAsync(limitedContext);

        Assert.Equal((int)HttpStatusCode.TooManyRequests, limitedContext.Response.StatusCode);
    }
}
