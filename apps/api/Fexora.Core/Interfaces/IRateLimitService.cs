namespace Fexora.Core.Interfaces;

public interface IRateLimitService
{
    Task<bool> CanExecuteAsync(Guid userId, string? rateLimitConfigJson);
    Task IncrementAsync(Guid userId);
    Task<bool> IsQuietHoursAsync();
    Task<bool> IsGlobalLimitReachedAsync();
    Task IncrementGlobalAsync();
}
