using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Fexora.Infrastructure.Services;

public class PushService(FexoraDbContext db, ILogger<PushService> logger) : IPushService
{
    public async Task SubscribeAsync(Guid userId, string endpoint, string p256dh, string auth, string? userAgent)
    {
        var existing = await db.Set<PushSubscription>()
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Endpoint == endpoint);

        if (existing is not null)
        {
            existing.P256dh = p256dh;
            existing.Auth = auth;
            existing.IsActive = true;
        }
        else
        {
            db.Add(new PushSubscription
            {
                UserId = userId,
                Endpoint = endpoint,
                P256dh = p256dh,
                Auth = auth,
                UserAgent = userAgent
            });
        }
        await db.SaveChangesAsync();
    }

    public async Task UnsubscribeAsync(Guid userId, string endpoint)
    {
        var sub = await db.Set<PushSubscription>()
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Endpoint == endpoint);
        if (sub is not null)
        {
            sub.IsActive = false;
            await db.SaveChangesAsync();
        }
    }

    public async Task SendPushAsync(Guid userId, string title, string body, string? url = null)
    {
        var subscriptions = await db.Set<PushSubscription>()
            .Where(s => s.UserId == userId && s.IsActive)
            .ToListAsync();

        if (subscriptions.Count == 0) return;

        // Web Push sending would require WebPush library
        // This is the integration point - log for now
        logger.LogInformation("Push notification for user {UserId}: {Title}", userId, title);

        foreach (var sub in subscriptions)
        {
            try
            {
                // Placeholder: actual WebPush implementation with VAPID keys
                logger.LogDebug("Sending push to endpoint {Endpoint}", sub.Endpoint[..Math.Min(50, sub.Endpoint.Length)]);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to send push to {Endpoint}", sub.Endpoint[..Math.Min(50, sub.Endpoint.Length)]);
                sub.IsActive = false;
            }
        }

        await db.SaveChangesAsync();
    }
}
