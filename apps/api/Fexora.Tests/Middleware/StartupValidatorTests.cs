using Fexora.Api.Middleware;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Moq;

namespace Fexora.Tests.Middleware;

public class StartupValidatorTests
{
    private static IConfiguration BuildConfig(Dictionary<string, string?> values)
    {
        return new ConfigurationBuilder()
            .AddInMemoryCollection(values)
            .Build();
    }

    private static IHostEnvironment DevEnv()
    {
        var env = new Mock<IHostEnvironment>();
        env.Setup(e => e.EnvironmentName).Returns("Development");
        return env.Object;
    }

    private static IHostEnvironment ProdEnv()
    {
        var env = new Mock<IHostEnvironment>();
        env.Setup(e => e.EnvironmentName).Returns("Production");
        return env.Object;
    }

    private static Dictionary<string, string?> ValidDevConfig() => new()
    {
        ["ConnectionStrings:Default"] = "Host=localhost;Database=fexora",
        ["Redis:Connection"] = "localhost:6379",
        ["Jwt:Secret"] = "dev-secret-key-change-in-production-min-32-chars!!",
        ["Jwt:Issuer"] = "fexora",
        ["Jwt:Audience"] = "fexora-clients",
    };

    [Fact]
    public void ValidDevConfig_DoesNotThrow()
    {
        var config = BuildConfig(ValidDevConfig());

        StartupValidator.ValidateConfiguration(config, DevEnv());
    }

    [Fact]
    public void MissingConnectionString_Throws()
    {
        var values = ValidDevConfig();
        values.Remove("ConnectionStrings:Default");
        var config = BuildConfig(values);

        var ex = Assert.Throws<InvalidOperationException>(() =>
            StartupValidator.ValidateConfiguration(config, DevEnv()));

        Assert.Contains("ConnectionStrings:Default", ex.Message);
    }

    [Fact]
    public void MissingRedis_Throws()
    {
        var values = ValidDevConfig();
        values.Remove("Redis:Connection");
        var config = BuildConfig(values);

        var ex = Assert.Throws<InvalidOperationException>(() =>
            StartupValidator.ValidateConfiguration(config, DevEnv()));

        Assert.Contains("Redis:Connection", ex.Message);
    }

    [Fact]
    public void MissingJwtSecret_Throws()
    {
        var values = ValidDevConfig();
        values.Remove("Jwt:Secret");
        var config = BuildConfig(values);

        var ex = Assert.Throws<InvalidOperationException>(() =>
            StartupValidator.ValidateConfiguration(config, DevEnv()));

        Assert.Contains("Jwt:Secret", ex.Message);
    }

    [Fact]
    public void ShortJwtSecret_Throws()
    {
        var values = ValidDevConfig();
        values["Jwt:Secret"] = "too-short";
        var config = BuildConfig(values);

        var ex = Assert.Throws<InvalidOperationException>(() =>
            StartupValidator.ValidateConfiguration(config, DevEnv()));

        Assert.Contains("at least 32 characters", ex.Message);
    }

    [Fact]
    public void Production_MissingSentryDsn_Throws()
    {
        var values = ValidDevConfig();
        values["Jwt:Secret"] = "a-production-safe-secret-that-is-at-least-32-chars!";
        var config = BuildConfig(values);

        var ex = Assert.Throws<InvalidOperationException>(() =>
            StartupValidator.ValidateConfiguration(config, ProdEnv()));

        Assert.Contains("Sentry:Dsn", ex.Message);
    }

    [Fact]
    public void Production_DevDefaultJwtSecret_Throws()
    {
        var values = ValidDevConfig();
        values["Sentry:Dsn"] = "https://sentry.example.com";
        var config = BuildConfig(values);

        var ex = Assert.Throws<InvalidOperationException>(() =>
            StartupValidator.ValidateConfiguration(config, ProdEnv()));

        Assert.Contains("must be changed from default", ex.Message);
    }

    [Fact]
    public void Production_PlaceholderStripeKey_Throws()
    {
        var values = ValidDevConfig();
        values["Jwt:Secret"] = "a-production-safe-secret-that-is-at-least-32-chars!";
        values["Sentry:Dsn"] = "https://sentry.example.com";
        values["Stripe:SecretKey"] = "sk_test_CHANGE_ME_something";
        var config = BuildConfig(values);

        var ex = Assert.Throws<InvalidOperationException>(() =>
            StartupValidator.ValidateConfiguration(config, ProdEnv()));

        Assert.Contains("Stripe:SecretKey", ex.Message);
    }

    [Fact]
    public void MultipleErrors_ReportsAll()
    {
        var config = BuildConfig(new Dictionary<string, string?>());

        var ex = Assert.Throws<InvalidOperationException>(() =>
            StartupValidator.ValidateConfiguration(config, DevEnv()));

        Assert.Contains("ConnectionStrings:Default", ex.Message);
        Assert.Contains("Redis:Connection", ex.Message);
        Assert.Contains("Jwt:Secret", ex.Message);
    }
}
