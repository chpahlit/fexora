using System.Security.Cryptography;
using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Fexora.Infrastructure.Services;

public class PasswordResetService(
    FexoraDbContext db,
    IEmailService emailService,
    IConfiguration config)
{
    public async Task RequestResetAsync(string email)
    {
        // Always return success to avoid email enumeration
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email.ToLowerInvariant().Trim());
        if (user == null) return;

        // Rate limit: max 3 tokens per hour per user
        var oneHourAgo = DateTime.UtcNow.AddHours(-1);
        var recentCount = await db.PasswordResetTokens
            .CountAsync(t => t.UserId == user.Id && t.CreatedAt > oneHourAgo);
        if (recentCount >= 3) return;

        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
            .Replace("+", "-").Replace("/", "_").TrimEnd('=');

        var resetToken = new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(1)
        };

        db.PasswordResetTokens.Add(resetToken);
        await db.SaveChangesAsync();

        var baseUrl = config["App:WebUrl"] ?? "https://fexora.de";
        var resetUrl = $"{baseUrl}/reset-password?token={token}";

        var html = $"""
            <h2>Passwort zurücksetzen</h2>
            <p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p>
            <p><a href="{resetUrl}">{resetUrl}</a></p>
            <p>Der Link ist 1 Stunde gültig.</p>
            <p>Falls du diese Anfrage nicht gestellt hast, ignoriere diese E-Mail.</p>
            """;

        await emailService.SendAsync(user.Email, "Fexora – Passwort zurücksetzen", html);
    }

    public async Task ConfirmResetAsync(string token, string newPassword)
    {
        var resetToken = await db.PasswordResetTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == token && !t.IsUsed && t.ExpiresAt > DateTime.UtcNow);

        if (resetToken == null)
            throw new ArgumentException("Ungültiger oder abgelaufener Token.");

        resetToken.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        resetToken.IsUsed = true;

        // Invalidate all refresh tokens for security
        var refreshTokens = await db.RefreshTokens
            .Where(r => r.UserId == resetToken.UserId && !r.IsRevoked)
            .ToListAsync();
        foreach (var rt in refreshTokens)
            rt.IsRevoked = true;

        await db.SaveChangesAsync();
    }
}
