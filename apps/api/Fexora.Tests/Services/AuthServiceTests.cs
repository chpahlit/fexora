using Fexora.Core.DTOs.Auth;
using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Fexora.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace Fexora.Tests.Services;

public class AuthServiceTests : IDisposable
{
    private readonly FexoraDbContext _db;
    private readonly Mock<ITokenService> _tokenService;
    private readonly AuthService _sut;

    public AuthServiceTests()
    {
        var options = new DbContextOptionsBuilder<FexoraDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _db = new FexoraDbContext(options);
        _tokenService = new Mock<ITokenService>();
        _tokenService.Setup(t => t.GenerateAccessToken(It.IsAny<User>())).Returns("test-access-token");
        _tokenService.Setup(t => t.GenerateRefreshToken()).Returns("test-refresh-token");

        _sut = new AuthService(_db, _tokenService.Object);
    }

    public void Dispose()
    {
        _db.Dispose();
    }

    private static RegisterRequest ValidRegisterRequest() => new()
    {
        Email = "user@fexora.de",
        Password = "SecurePassword123!",
        Username = "testuser",
        IsOver18 = true,
    };

    [Fact]
    public async Task Register_WithValidData_ReturnsAuthResponse()
    {
        var request = ValidRegisterRequest();

        var result = await _sut.RegisterAsync(request);

        Assert.NotNull(result);
        Assert.Equal("test-access-token", result.AccessToken);
        Assert.Equal("test-refresh-token", result.RefreshToken);
        Assert.Equal("user@fexora.de", result.User.Email);
        Assert.Equal("testuser", result.User.Username);
        Assert.Equal("User", result.User.Role);
    }

    [Fact]
    public async Task Register_CreatesUserInDatabase()
    {
        await _sut.RegisterAsync(ValidRegisterRequest());

        var user = await _db.Users.Include(u => u.Profile).FirstOrDefaultAsync();
        Assert.NotNull(user);
        Assert.Equal("user@fexora.de", user.Email);
        Assert.Equal(Role.User, user.Role);
        Assert.True(user.IsActive);
        Assert.True(user.IsVerified18);
        Assert.NotNull(user.Profile);
        Assert.Equal("testuser", user.Profile!.Username);
    }

    [Fact]
    public async Task Register_CreatesWallet()
    {
        await _sut.RegisterAsync(ValidRegisterRequest());

        var wallet = await _db.CreditWallets.FirstOrDefaultAsync();
        Assert.NotNull(wallet);
        Assert.Equal(0, wallet.Balance);
    }

    [Fact]
    public async Task Register_HashesPassword()
    {
        await _sut.RegisterAsync(ValidRegisterRequest());

        var user = await _db.Users.FirstAsync();
        Assert.NotEqual("SecurePassword123!", user.PasswordHash);
        Assert.True(BCrypt.Net.BCrypt.Verify("SecurePassword123!", user.PasswordHash));
    }

    [Fact]
    public async Task Register_NormalizesEmail()
    {
        var request = ValidRegisterRequest();
        request.Email = "  USER@Fexora.DE  ";

        await _sut.RegisterAsync(request);

        var user = await _db.Users.FirstAsync();
        Assert.Equal("user@fexora.de", user.Email);
    }

    [Fact]
    public async Task Register_UnderAge_ThrowsArgumentException()
    {
        var request = ValidRegisterRequest();
        request.IsOver18 = false;

        await Assert.ThrowsAsync<ArgumentException>(() => _sut.RegisterAsync(request));
    }

    [Fact]
    public async Task Register_DuplicateEmail_ThrowsArgumentException()
    {
        await _sut.RegisterAsync(ValidRegisterRequest());

        var request = ValidRegisterRequest();
        request.Username = "differentuser";

        await Assert.ThrowsAsync<ArgumentException>(() => _sut.RegisterAsync(request));
    }

    [Fact]
    public async Task Register_DuplicateUsername_ThrowsArgumentException()
    {
        await _sut.RegisterAsync(ValidRegisterRequest());

        var request = ValidRegisterRequest();
        request.Email = "other@fexora.de";

        await Assert.ThrowsAsync<ArgumentException>(() => _sut.RegisterAsync(request));
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsAuthResponse()
    {
        await _sut.RegisterAsync(ValidRegisterRequest());

        var result = await _sut.LoginAsync(new LoginRequest
        {
            Email = "user@fexora.de",
            Password = "SecurePassword123!"
        });

        Assert.NotNull(result);
        Assert.Equal("test-access-token", result.AccessToken);
        Assert.Equal("user@fexora.de", result.User.Email);
    }

    [Fact]
    public async Task Login_WrongPassword_ThrowsUnauthorized()
    {
        await _sut.RegisterAsync(ValidRegisterRequest());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _sut.LoginAsync(new LoginRequest
            {
                Email = "user@fexora.de",
                Password = "WrongPassword"
            }));
    }

    [Fact]
    public async Task Login_NonExistentEmail_ThrowsUnauthorized()
    {
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _sut.LoginAsync(new LoginRequest
            {
                Email = "noone@fexora.de",
                Password = "Password123!"
            }));
    }

    [Fact]
    public async Task Login_InactiveUser_ThrowsUnauthorized()
    {
        await _sut.RegisterAsync(ValidRegisterRequest());
        var user = await _db.Users.FirstAsync();
        user.IsActive = false;
        await _db.SaveChangesAsync();

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _sut.LoginAsync(new LoginRequest
            {
                Email = "user@fexora.de",
                Password = "SecurePassword123!"
            }));
    }

    [Fact]
    public async Task Refresh_WithValidToken_ReturnsNewAuthResponse()
    {
        await _sut.RegisterAsync(ValidRegisterRequest());

        var result = await _sut.RefreshAsync("test-refresh-token");

        Assert.NotNull(result);
        Assert.Equal("test-access-token", result.AccessToken);
    }

    [Fact]
    public async Task Refresh_RevokesOldToken()
    {
        await _sut.RegisterAsync(ValidRegisterRequest());

        await _sut.RefreshAsync("test-refresh-token");

        var oldToken = await _db.RefreshTokens.FirstAsync(r => r.Token == "test-refresh-token");
        Assert.True(oldToken.IsRevoked);
    }

    [Fact]
    public async Task Refresh_InvalidToken_ThrowsUnauthorized()
    {
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _sut.RefreshAsync("nonexistent-token"));
    }

    [Fact]
    public async Task Revoke_MarksTokenAsRevoked()
    {
        await _sut.RegisterAsync(ValidRegisterRequest());

        await _sut.RevokeAsync("test-refresh-token");

        var token = await _db.RefreshTokens.FirstAsync();
        Assert.True(token.IsRevoked);
    }

    [Fact]
    public async Task GetUserInfo_ExistingUser_ReturnsUserInfo()
    {
        await _sut.RegisterAsync(ValidRegisterRequest());
        var user = await _db.Users.FirstAsync();

        var info = await _sut.GetUserInfoAsync(user.Id);

        Assert.NotNull(info);
        Assert.Equal("user@fexora.de", info.Email);
        Assert.Equal("testuser", info.Username);
        Assert.Equal("User", info.Role);
    }

    [Fact]
    public async Task GetUserInfo_NonExistentUser_ReturnsNull()
    {
        var info = await _sut.GetUserInfoAsync(Guid.NewGuid());

        Assert.Null(info);
    }
}
