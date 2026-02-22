namespace Fexora.Core.Interfaces;

public interface IPushService
{
    Task SubscribeAsync(Guid userId, string endpoint, string p256dh, string auth, string? userAgent);
    Task UnsubscribeAsync(Guid userId, string endpoint);
    Task SendPushAsync(Guid userId, string title, string body, string? url = null);
}
