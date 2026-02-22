using Fexora.Api.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Moq;

namespace Fexora.Tests.Middleware;

public class SecurityHeadersMiddlewareTests
{
    private static DefaultHttpContext CreateContext(bool isDevelopment)
    {
        var env = new Mock<IHostEnvironment>();
        env.Setup(e => e.EnvironmentName).Returns(isDevelopment ? "Development" : "Production");

        var services = new ServiceCollection();
        services.AddSingleton(env.Object);

        var context = new DefaultHttpContext
        {
            RequestServices = services.BuildServiceProvider()
        };
        return context;
    }

    [Fact]
    public async Task SetsXContentTypeOptions()
    {
        var middleware = new SecurityHeadersMiddleware(_ => Task.CompletedTask);
        var context = CreateContext(isDevelopment: true);

        await middleware.InvokeAsync(context);

        Assert.Equal("nosniff", context.Response.Headers["X-Content-Type-Options"]);
    }

    [Fact]
    public async Task SetsXFrameOptions()
    {
        var middleware = new SecurityHeadersMiddleware(_ => Task.CompletedTask);
        var context = CreateContext(isDevelopment: true);

        await middleware.InvokeAsync(context);

        Assert.Equal("DENY", context.Response.Headers["X-Frame-Options"]);
    }

    [Fact]
    public async Task SetsXXssProtection()
    {
        var middleware = new SecurityHeadersMiddleware(_ => Task.CompletedTask);
        var context = CreateContext(isDevelopment: true);

        await middleware.InvokeAsync(context);

        Assert.Equal("1; mode=block", context.Response.Headers["X-XSS-Protection"]);
    }

    [Fact]
    public async Task SetsReferrerPolicy()
    {
        var middleware = new SecurityHeadersMiddleware(_ => Task.CompletedTask);
        var context = CreateContext(isDevelopment: true);

        await middleware.InvokeAsync(context);

        Assert.Equal("strict-origin-when-cross-origin", context.Response.Headers["Referrer-Policy"]);
    }

    [Fact]
    public async Task SetsPermissionsPolicy()
    {
        var middleware = new SecurityHeadersMiddleware(_ => Task.CompletedTask);
        var context = CreateContext(isDevelopment: true);

        await middleware.InvokeAsync(context);

        Assert.Equal("camera=(), microphone=(), geolocation=(), payment=()",
            context.Response.Headers["Permissions-Policy"]);
    }

    [Fact]
    public async Task SetsCSP()
    {
        var middleware = new SecurityHeadersMiddleware(_ => Task.CompletedTask);
        var context = CreateContext(isDevelopment: true);

        await middleware.InvokeAsync(context);

        Assert.Equal("default-src 'none'; frame-ancestors 'none'",
            context.Response.Headers["Content-Security-Policy"]);
    }

    [Fact]
    public async Task Production_SetsHSTS()
    {
        var middleware = new SecurityHeadersMiddleware(_ => Task.CompletedTask);
        var context = CreateContext(isDevelopment: false);

        await middleware.InvokeAsync(context);

        Assert.Equal("max-age=31536000; includeSubDomains",
            context.Response.Headers["Strict-Transport-Security"]);
    }

    [Fact]
    public async Task Development_DoesNotSetHSTS()
    {
        var middleware = new SecurityHeadersMiddleware(_ => Task.CompletedTask);
        var context = CreateContext(isDevelopment: true);

        await middleware.InvokeAsync(context);

        Assert.False(context.Response.Headers.ContainsKey("Strict-Transport-Security"));
    }
}
