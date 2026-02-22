using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Orchestrator.Workers;

public class VisitWorker(FexoraDbContext db) : IActionWorker
{
    public ActionType ActionType => ActionType.Visit;

    public async Task<ExecutionResult> ExecuteAsync(ScenarioStep step, Guid userId)
    {
        // Check if already executed (idempotency)
        var alreadyVisited = await db.FeedEvents
            .AnyAsync(f => f.UserId == userId
                && f.EventType == "visit"
                && f.EntityId == (step.SenderProfileId ?? Guid.Empty)
                && f.CreatedAt > DateTime.UtcNow.AddHours(-24));

        if (alreadyVisited)
            return ExecutionResult.Skipped;

        db.FeedEvents.Add(new FeedEvent
        {
            UserId = userId,
            EventType = "visit",
            EntityId = step.SenderProfileId ?? Guid.Empty,
            CreatedAt = DateTime.UtcNow
        });

        db.Notifications.Add(new Notification
        {
            UserId = userId,
            Type = NotificationType.System,
            ActorId = step.SenderProfileId,
            Title = "Someone visited your profile",
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();
        return ExecutionResult.Success;
    }
}
