namespace Fexora.Api.Middleware;

public class RequestValidationMiddleware(RequestDelegate next)
{
    // Max request body size: 50 MB (for file uploads)
    private const long MaxBodySize = 50 * 1024 * 1024;

    public async Task InvokeAsync(HttpContext context)
    {
        // Enforce max request body size
        if (context.Request.ContentLength > MaxBodySize)
        {
            context.Response.StatusCode = 413;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(
                """{"success":false,"error":"Anfrage zu groß. Maximum: 50 MB."}""");
            return;
        }

        await next(context);
    }
}
