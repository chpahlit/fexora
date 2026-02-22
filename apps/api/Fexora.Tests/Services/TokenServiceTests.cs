using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Infrastructure.Services;
using Microsoft.Extensions.Configuration;

namespace Fexora.Tests.Services;

public class TokenServiceTests
{
    private readonly TokenService _sut;
    private const string JwtSecret = "this-is-a-test-secret-key-at-least-32-chars!!";

    public TokenServiceTests()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Secret"] = JwtSecret,
                ["Jwt:Issuer"] = "fexora-test",
                ["Jwt:Audience"] = "fexora-test-audience",
                ["Jwt:ExpirationMinutes"] = "30",
            })
            .Build();

        _sut = new TokenService(config);
    }

    private static User CreateTestUser(Role role = Role.User, string? username = null)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "test@fexora.de",
            Role = role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        if (username is not null)
        {
            user.Profile = new Profile
            {
                UserId = user.Id,
                Username = username,
                UpdatedAt = DateTime.UtcNow
            };
        }

        return user;
    }

    [Fact]
    public void GenerateAccessToken_ReturnsValidJwt()
    {
        var user = CreateTestUser();

        var token = _sut.GenerateAccessToken(user);

        Assert.NotEmpty(token);
        var handler = new JwtSecurityTokenHandler();
        Assert.True(handler.CanReadToken(token));
    }

    [Fact]
    public void GenerateAccessToken_ContainsCorrectClaims()
    {
        var user = CreateTestUser(Role.Admin, "admin_user");

        var token = _sut.GenerateAccessToken(user);

        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);

        Assert.Equal(user.Id.ToString(), jwt.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
        Assert.Equal(user.Email, jwt.Claims.First(c => c.Type == ClaimTypes.Email).Value);
        Assert.Equal("Admin", jwt.Claims.First(c => c.Type == ClaimTypes.Role).Value);
        Assert.Equal("admin_user", jwt.Claims.First(c => c.Type == "username").Value);
    }

    [Fact]
    public void GenerateAccessToken_WithoutProfile_DoesNotIncludeUsername()
    {
        var user = CreateTestUser();

        var token = _sut.GenerateAccessToken(user);

        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);

        Assert.DoesNotContain(jwt.Claims, c => c.Type == "username");
    }

    [Fact]
    public void GenerateAccessToken_HasCorrectExpiration()
    {
        var user = CreateTestUser();
        var before = DateTime.UtcNow;

        var token = _sut.GenerateAccessToken(user);

        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);

        Assert.True(jwt.ValidTo > before.AddMinutes(29));
        Assert.True(jwt.ValidTo < before.AddMinutes(31));
    }

    [Fact]
    public void GenerateAccessToken_HasCorrectIssuerAndAudience()
    {
        var user = CreateTestUser();

        var token = _sut.GenerateAccessToken(user);

        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);

        Assert.Equal("fexora-test", jwt.Issuer);
        Assert.Contains("fexora-test-audience", jwt.Audiences);
    }

    [Fact]
    public void GenerateRefreshToken_ReturnsBase64String()
    {
        var token = _sut.GenerateRefreshToken();

        Assert.NotEmpty(token);
        var bytes = Convert.FromBase64String(token);
        Assert.Equal(64, bytes.Length);
    }

    [Fact]
    public void GenerateRefreshToken_IsUnique()
    {
        var tokens = Enumerable.Range(0, 100).Select(_ => _sut.GenerateRefreshToken()).ToList();

        Assert.Equal(100, tokens.Distinct().Count());
    }

    [Theory]
    [InlineData(Role.Guest)]
    [InlineData(Role.User)]
    [InlineData(Role.Creator)]
    [InlineData(Role.Moderator)]
    [InlineData(Role.Admin)]
    public void GenerateAccessToken_ContainsCorrectRole(Role role)
    {
        var user = CreateTestUser(role);

        var token = _sut.GenerateAccessToken(user);

        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);

        Assert.Equal(role.ToString(), jwt.Claims.First(c => c.Type == ClaimTypes.Role).Value);
    }
}
