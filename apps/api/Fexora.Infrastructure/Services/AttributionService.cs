using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class AttributionService(FexoraDbContext db) : IAttributionService
{
    public async Task<Guid?> FindAttributableModerator(Guid buyerId, int windowMinutes = 30)
    {
        var cutoff = DateTime.UtcNow.AddMinutes(-windowMinutes);

        // Find the most recent moderator who interacted with this buyer within the window
        var moderatorId = await db.Messages
            .Where(m =>
                m.ReceiverId == buyerId &&
                m.CreatedAt >= cutoff &&
                m.Sender.Role == Role.Moderator)
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => (Guid?)m.SenderId)
            .FirstOrDefaultAsync();

        return moderatorId;
    }

    public async Task AttributePurchase(Guid purchaseId, Guid moderatorId, int windowSec)
    {
        var purchase = await db.Purchases.FindAsync(purchaseId);
        if (purchase == null) return;

        purchase.AttributedToModeratorId = moderatorId;
        purchase.AttributedWindowSec = windowSec;
        await db.SaveChangesAsync();
    }
}
