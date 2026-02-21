namespace Fexora.Core.Interfaces;

public interface IAttributionService
{
    Task<Guid?> FindAttributableModerator(Guid buyerId, int windowMinutes = 30);
    Task AttributePurchase(Guid purchaseId, Guid moderatorId, int windowSec);
}
