using System.Net.Http.Json;
using System.Text.Json;
using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Fexora.Infrastructure.Services;

public class SocialAuthService(
    FexoraDbContext db,
    ITokenService tokenService,
    IHttpClientFactory httpClientFactory,
    IConfiguration config) : ISocialAuthService
{
    public async Task<(User user, string accessToken, string refreshToken)> LoginWithGoogleAsync(string idToken)
    {
        // Verify Google ID token
        var client = httpClientFactory.CreateClient();
        var response = await client.GetAsync($"https://oauth2.googleapis.com/tokeninfo?id_token={idToken}");
        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<JsonElement>();
        var email = payload.GetProperty("email").GetString()
            ?? throw new ArgumentException("No email in Google token.");
        var googleUserId = payload.GetProperty("sub").GetString()!;

        // Verify audience
        var expectedClientId = config["Auth:Google:ClientId"];
        var aud = payload.GetProperty("aud").GetString();
        if (expectedClientId is not null && aud != expectedClientId)
            throw new ArgumentException("Invalid Google client ID.");

        // Find existing linked account
        var social = await db.Set<SocialLogin>()
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Provider == "Google" && s.ProviderUserId == googleUserId);

        User user;
        if (social is not null)
        {
            user = social.User;
        }
        else
        {
            // Check if user with this email exists
            user = await db.Users.FirstOrDefaultAsync(u => u.Email == email)
                ?? await CreateUserFromSocialAsync(email);

            await LinkSocialAsync(user.Id, "Google", googleUserId, email);
        }

        if (!user.IsActive)
            throw new InvalidOperationException("Account is deactivated.");

        var accessToken = tokenService.GenerateAccessToken(user);
        var refreshToken = await CreateRefreshTokenAsync(user.Id);
        return (user, accessToken, refreshToken.Token);
    }

    public async Task<(User user, string accessToken, string refreshToken)> LoginWithAppleAsync(string idToken, string? name)
    {
        // Apple ID token verification would use Apple's public keys
        // Simplified: decode JWT payload
        var parts = idToken.Split('.');
        if (parts.Length != 3)
            throw new ArgumentException("Invalid Apple ID token.");

        var payloadJson = System.Text.Encoding.UTF8.GetString(
            Convert.FromBase64String(PadBase64(parts[1])));
        var payload = JsonSerializer.Deserialize<JsonElement>(payloadJson);

        var email = payload.GetProperty("email").GetString()
            ?? throw new ArgumentException("No email in Apple token.");
        var appleUserId = payload.GetProperty("sub").GetString()!;

        var social = await db.Set<SocialLogin>()
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Provider == "Apple" && s.ProviderUserId == appleUserId);

        User user;
        if (social is not null)
        {
            user = social.User;
        }
        else
        {
            user = await db.Users.FirstOrDefaultAsync(u => u.Email == email)
                ?? await CreateUserFromSocialAsync(email);

            await LinkSocialAsync(user.Id, "Apple", appleUserId, email);
        }

        if (!user.IsActive)
            throw new InvalidOperationException("Account is deactivated.");

        var accessToken = tokenService.GenerateAccessToken(user);
        var refreshToken = await CreateRefreshTokenAsync(user.Id);
        return (user, accessToken, refreshToken.Token);
    }

    public async Task LinkSocialAsync(Guid userId, string provider, string providerUserId, string? email)
    {
        var existing = await db.Set<SocialLogin>()
            .AnyAsync(s => s.UserId == userId && s.Provider == provider);
        if (existing) return;

        db.Add(new SocialLogin
        {
            UserId = userId,
            Provider = provider,
            ProviderUserId = providerUserId,
            Email = email
        });
        await db.SaveChangesAsync();
    }

    public async Task UnlinkSocialAsync(Guid userId, string provider)
    {
        var social = await db.Set<SocialLogin>()
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Provider == provider);
        if (social is not null)
        {
            db.Remove(social);
            await db.SaveChangesAsync();
        }
    }

    private async Task<RefreshToken> CreateRefreshTokenAsync(Guid userId)
    {
        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Token = tokenService.GenerateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        };
        db.RefreshTokens.Add(refreshToken);
        await db.SaveChangesAsync();
        return refreshToken;
    }

    private async Task<User> CreateUserFromSocialAsync(string email)
    {
        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Email = email,
            PasswordHash = "", // No password for social login
            Role = Role.User,
            IsActive = true,
            ConsentPrivacyPolicy = true,
            ConsentTermsOfService = true,
            ConsentGivenAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        db.Users.Add(user);

        db.Profiles.Add(new Profile
        {
            UserId = userId,
            Username = email.Split('@')[0] + new Random().Next(1000, 9999),
            UpdatedAt = DateTime.UtcNow
        });

        db.CreditWallets.Add(new CreditWallet
        {
            UserId = userId,
            Balance = 0,
            UpdatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();
        return user;
    }

    private static string PadBase64(string base64)
    {
        base64 = base64.Replace('-', '+').Replace('_', '/');
        return base64.PadRight(base64.Length + (4 - base64.Length % 4) % 4, '=');
    }
}
