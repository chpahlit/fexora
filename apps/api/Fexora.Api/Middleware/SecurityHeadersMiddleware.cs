namespace Fexora.Api.Middleware;

public class SecurityHeadersMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var headers = context.Response.Headers;

        // Prevent MIME sniffing
        headers["X-Content-Type-Options"] = "nosniff";

        // Clickjacking protection
        headers["X-Frame-Options"] = "DENY";

        // XSS filter (legacy browsers)
        headers["X-XSS-Protection"] = "1; mode=block";

        // Referrer policy
        headers["Referrer-Policy"] = "strict-origin-when-cross-origin";

        // Permissions policy (disable unused browser features)
        headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()";

        // HSTS (only in production, 1 year + includeSubDomains)
        if (!context.RequestServices.GetRequiredService<IHostEnvironment>().IsDevelopment())
        {
            headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
        }

        // Content Security Policy for API responses
        headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'";

        await next(context);
    }
}
