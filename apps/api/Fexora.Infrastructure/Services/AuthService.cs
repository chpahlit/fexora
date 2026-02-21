using Fexora.Core.DTOs.Auth;
using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class AuthService(
    FexoraDbContext db,
    ITokenService tokenService) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (!request.IsOver18)
            throw new ArgumentException("Du musst mindestens 18 Jahre alt sein.");

        if (await db.Users.AnyAsync(u => u.Email == request.Email))
            throw new ArgumentException("Diese E-Mail ist bereits registriert.");

        if (await db.Profiles.AnyAsync(p => p.Username == request.Username))
            throw new ArgumentException("Dieser Benutzername ist bereits vergeben.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email.ToLowerInvariant().Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = Role.User,
            IsVerified18 = true,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var profile = new Profile
        {
            UserId = user.Id,
            Username = request.Username.Trim(),
            UpdatedAt = DateTime.UtcNow
        };

        var wallet = new CreditWallet
        {
            UserId = user.Id,
            Balance = 0,
            UpdatedAt = DateTime.UtcNow
        };

        db.Users.Add(user);
        db.Profiles.Add(profile);
        db.CreditWallets.Add(wallet);

        var refreshToken = CreateRefreshToken(user.Id);
        db.RefreshTokens.Add(refreshToken);

        await db.SaveChangesAsync();

        user.Profile = profile;

        return BuildAuthResponse(user, refreshToken);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await db.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Email == request.Email.ToLowerInvariant().Trim());

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Ungültige E-Mail oder Passwort.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Dein Konto wurde deaktiviert.");

        var refreshToken = CreateRefreshToken(user.Id);
        db.RefreshTokens.Add(refreshToken);
        await db.SaveChangesAsync();

        return BuildAuthResponse(user, refreshToken);
    }

    public async Task<AuthResponse> RefreshAsync(string token)
    {
        var refreshToken = await db.RefreshTokens
            .Include(r => r.User)
            .ThenInclude(u => u.Profile)
            .FirstOrDefaultAsync(r => r.Token == token && !r.IsRevoked);

        if (refreshToken is null || refreshToken.ExpiresAt < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Ungültiger oder abgelaufener Refresh-Token.");

        // Revoke old token
        refreshToken.IsRevoked = true;

        // Create new refresh token
        var newRefreshToken = CreateRefreshToken(refreshToken.UserId);
        db.RefreshTokens.Add(newRefreshToken);
        await db.SaveChangesAsync();

        return BuildAuthResponse(refreshToken.User, newRefreshToken);
    }

    public async Task RevokeAsync(string token)
    {
        var refreshToken = await db.RefreshTokens
            .FirstOrDefaultAsync(r => r.Token == token && !r.IsRevoked);

        if (refreshToken is not null)
        {
            refreshToken.IsRevoked = true;
            await db.SaveChangesAsync();
        }
    }

    public async Task<UserInfo?> GetUserInfoAsync(Guid userId)
    {
        var user = await db.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null) return null;

        return new UserInfo
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.Profile?.Username ?? "",
            Role = user.Role.ToString(),
            AvatarUrl = user.Profile?.AvatarUrl
        };
    }

    private RefreshToken CreateRefreshToken(Guid userId)
    {
        return new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Token = tokenService.GenerateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        };
    }

    private AuthResponse BuildAuthResponse(User user, RefreshToken refreshToken)
    {
        var accessToken = tokenService.GenerateAccessToken(user);
        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60),
            User = new UserInfo
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Profile?.Username ?? "",
                Role = user.Role.ToString(),
                AvatarUrl = user.Profile?.AvatarUrl
            }
        };
    }
}
