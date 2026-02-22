using System.Net;
using System.Text.Json;
using Fexora.Api.Middleware;
using Fexora.Core.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;

namespace Fexora.Tests.Middleware;

public class GlobalExceptionMiddlewareTests
{
    private readonly Mock<ILogger<GlobalExceptionMiddleware>> _logger = new();

    private GlobalExceptionMiddleware CreateMiddleware(RequestDelegate next)
    {
        return new GlobalExceptionMiddleware(next, _logger.Object);
    }

    private static DefaultHttpContext CreateContext()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();
        return context;
    }

    private static async Task<ApiResponse<object>?> ReadResponseBody(HttpContext context)
    {
        context.Response.Body.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(context.Response.Body);
        var body = await reader.ReadToEndAsync();
        return JsonSerializer.Deserialize<ApiResponse<object>>(body, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });
    }

    [Fact]
    public async Task NoException_PassesThrough()
    {
        var middleware = CreateMiddleware(_ => Task.CompletedTask);
        var context = CreateContext();

        await middleware.InvokeAsync(context);

        Assert.Equal(200, context.Response.StatusCode);
    }

    [Fact]
    public async Task ArgumentException_Returns400()
    {
        var middleware = CreateMiddleware(_ => throw new ArgumentException("Bad input"));
        var context = CreateContext();

        await middleware.InvokeAsync(context);

        Assert.Equal((int)HttpStatusCode.BadRequest, context.Response.StatusCode);
        var response = await ReadResponseBody(context);
        Assert.False(response?.Success);
        Assert.Equal("Bad input", response?.Error);
    }

    [Fact]
    public async Task UnauthorizedAccessException_Returns401()
    {
        var middleware = CreateMiddleware(_ => throw new UnauthorizedAccessException("Not allowed"));
        var context = CreateContext();

        await middleware.InvokeAsync(context);

        Assert.Equal((int)HttpStatusCode.Unauthorized, context.Response.StatusCode);
    }

    [Fact]
    public async Task InvalidOperationException_Returns409()
    {
        var middleware = CreateMiddleware(_ => throw new InvalidOperationException("Conflict"));
        var context = CreateContext();

        await middleware.InvokeAsync(context);

        Assert.Equal((int)HttpStatusCode.Conflict, context.Response.StatusCode);
    }

    [Fact]
    public async Task KeyNotFoundException_Returns404()
    {
        var middleware = CreateMiddleware(_ => throw new KeyNotFoundException("Not found"));
        var context = CreateContext();

        await middleware.InvokeAsync(context);

        Assert.Equal((int)HttpStatusCode.NotFound, context.Response.StatusCode);
    }

    [Fact]
    public async Task UnhandledException_Returns500_WithGenericMessage()
    {
        var middleware = CreateMiddleware(_ => throw new NullReferenceException("secret details"));
        var context = CreateContext();

        await middleware.InvokeAsync(context);

        Assert.Equal((int)HttpStatusCode.InternalServerError, context.Response.StatusCode);
        var response = await ReadResponseBody(context);
        Assert.DoesNotContain("secret details", response?.Error);
        Assert.Equal("Ein interner Fehler ist aufgetreten.", response?.Error);
    }

    [Fact]
    public async Task Response_IsJson()
    {
        var middleware = CreateMiddleware(_ => throw new ArgumentException("test"));
        var context = CreateContext();

        await middleware.InvokeAsync(context);

        Assert.Equal("application/json", context.Response.ContentType);
    }
}
