using Fexora.Api.Middleware;
using Microsoft.AspNetCore.Http;

namespace Fexora.Tests.Middleware;

public class RequestValidationMiddlewareTests
{
    [Fact]
    public async Task NormalRequest_PassesThrough()
    {
        var nextCalled = false;
        var middleware = new RequestValidationMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        var context = new DefaultHttpContext();
        context.Request.ContentLength = 1024; // 1 KB

        await middleware.InvokeAsync(context);

        Assert.True(nextCalled);
    }

    [Fact]
    public async Task OversizedRequest_Returns413()
    {
        var nextCalled = false;
        var middleware = new RequestValidationMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();
        context.Request.ContentLength = 51 * 1024 * 1024; // 51 MB

        await middleware.InvokeAsync(context);

        Assert.False(nextCalled);
        Assert.Equal(413, context.Response.StatusCode);
    }

    [Fact]
    public async Task ExactlyAtLimit_PassesThrough()
    {
        var nextCalled = false;
        var middleware = new RequestValidationMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        var context = new DefaultHttpContext();
        context.Request.ContentLength = 50 * 1024 * 1024; // Exactly 50 MB

        await middleware.InvokeAsync(context);

        Assert.True(nextCalled);
    }

    [Fact]
    public async Task NoContentLength_PassesThrough()
    {
        var nextCalled = false;
        var middleware = new RequestValidationMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        var context = new DefaultHttpContext();
        // ContentLength is null by default

        await middleware.InvokeAsync(context);

        Assert.True(nextCalled);
    }
}
