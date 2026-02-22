namespace Fexora.Api.Middleware;

public static class StartupValidator
{
    public static void ValidateConfiguration(IConfiguration config, IHostEnvironment env)
    {
        var errors = new List<string>();

        // Always required
        RequireNotEmpty(config, "ConnectionStrings:Default", errors);
        RequireNotEmpty(config, "Redis:Connection", errors);
        RequireNotEmpty(config, "Jwt:Secret", errors);
        RequireNotEmpty(config, "Jwt:Issuer", errors);
        RequireNotEmpty(config, "Jwt:Audience", errors);

        // JWT secret must be at least 32 chars
        var jwtSecret = config["Jwt:Secret"];
        if (jwtSecret is not null && jwtSecret.Length < 32)
            errors.Add("Jwt:Secret must be at least 32 characters.");

        // Production-only validations
        if (!env.IsDevelopment())
        {
            RequireNotEmpty(config, "Sentry:Dsn", errors);

            // Warn about placeholder values
            WarnPlaceholder(config, "Stripe:SecretKey", "sk_test_CHANGE_ME", errors);
            WarnPlaceholder(config, "Resend:ApiKey", "re_CHANGE_ME", errors);
            WarnPlaceholder(config, "Auth:Google:ClientId", "CHANGE_ME", errors);

            // JWT secret must not be the dev default
            if (jwtSecret == "dev-secret-key-change-in-production-min-32-chars!!")
                errors.Add("Jwt:Secret must be changed from default in production.");
        }

        if (errors.Count > 0)
        {
            var message = $"Configuration validation failed:\n  - {string.Join("\n  - ", errors)}";
            throw new InvalidOperationException(message);
        }
    }

    private static void RequireNotEmpty(IConfiguration config, string key, List<string> errors)
    {
        if (string.IsNullOrWhiteSpace(config[key]))
            errors.Add($"Required configuration '{key}' is missing or empty.");
    }

    private static void WarnPlaceholder(IConfiguration config, string key, string placeholder, List<string> errors)
    {
        var value = config[key];
        if (value is not null && value.Contains(placeholder, StringComparison.OrdinalIgnoreCase))
            errors.Add($"Configuration '{key}' still contains placeholder value.");
    }
}
