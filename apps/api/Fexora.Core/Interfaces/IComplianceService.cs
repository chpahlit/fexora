namespace Fexora.Core.Interfaces;

public interface IComplianceService
{
    Task<bool> CanExecuteActionAsync(Guid userId);
    Task<bool> IsBlacklistedAsync(Guid userId);
    Task AddToBlacklistAsync(Guid userId, string? reason);
    Task RemoveFromBlacklistAsync(Guid userId);
    Task<bool> HasMarketingConsentAsync(Guid userId);
}
