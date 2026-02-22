using System.Net;
using System.Security.Claims;
using System.Text.Json;
using Fexora.Core.DTOs;
using Microsoft.Extensions.Caching.Distributed;

namespace Fexora.Api.Middleware;

public class RateLimitingMiddleware(RequestDelegate next, IDistributedCache cache, IConfiguration config)
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    // Configurable limits
    private int GlobalRpm => config.GetValue("RateLimiting:GlobalRpm", 120);
    private int AuthenticatedRpm => config.GetValue("RateLimiting:AuthenticatedRpm", 60);
    private int AnonymousRpm => config.GetValue("RateLimiting:AnonymousRpm", 30);
    private int AuthEndpointRpm => config.GetValue("RateLimiting:AuthEndpointRpm", 10);

    public async Task InvokeAsync(HttpContext context)
    {
        // Skip health checks and OpenAPI
        var path = context.Request.Path.Value ?? "";
        if (path.StartsWith("/health") || path.StartsWith("/openapi") || path.StartsWith("/scalar"))
        {
            await next(context);
            return;
        }

        var clientId = GetClientIdentifier(context);
        var limit = GetLimit(context, path);
        var key = $"ratelimit:{clientId}:{DateTime.UtcNow:yyyyMMddHHmm}";

        var countStr = await cache.GetStringAsync(key);
        var count = countStr is not null ? int.Parse(countStr) : 0;

        // Set rate limit headers
        context.Response.Headers["X-RateLimit-Limit"] = limit.ToString();
        context.Response.Headers["X-RateLimit-Remaining"] = Math.Max(0, limit - count - 1).ToString();

        if (count >= limit)
        {
            context.Response.Headers["Retry-After"] = "60";
            context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
            context.Response.ContentType = "application/json";
            var response = ApiResponse<object>.Fail("Zu viele Anfragen. Bitte warte einen Moment.");
            await context.Response.WriteAsync(JsonSerializer.Serialize(response, JsonOptions));
            return;
        }

        await cache.SetStringAsync(key, (count + 1).ToString(), new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1)
        });

        await next(context);
    }

    private static string GetClientIdentifier(HttpContext context)
    {
        var userId = context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(userId))
            return $"user:{userId}";

        // Fall back to IP
        var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var forwarded = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwarded))
            ip = forwarded.Split(',')[0].Trim();

        return $"ip:{ip}";
    }

    private int GetLimit(HttpContext context, string path)
    {
        // Stricter limits on auth endpoints
        if (path.StartsWith("/auth/login") || path.StartsWith("/auth/register") || path.StartsWith("/auth/password-reset"))
            return AuthEndpointRpm;

        var isAuthenticated = context.User?.Identity?.IsAuthenticated ?? false;
        return isAuthenticated ? AuthenticatedRpm : AnonymousRpm;
    }
}
