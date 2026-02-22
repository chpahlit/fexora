using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Orchestrator.Workers;

public class LikeWorker(FexoraDbContext db) : IActionWorker
{
    public ActionType ActionType => ActionType.Like;

    public async Task<ExecutionResult> ExecuteAsync(ScenarioStep step, Guid userId)
    {
        if (step.SenderProfileId is null || step.ContentIdTarget is null)
            return ExecutionResult.Failed;

        var contentId = Guid.Parse(step.ContentIdTarget);
        var likerId = step.SenderProfileId.Value;

        // Duplicate check
        var alreadyLiked = await db.Likes
            .AnyAsync(l => l.UserId == likerId && l.ContentId == contentId);
        if (alreadyLiked)
            return ExecutionResult.Skipped;

        var content = await db.Contents.FindAsync(contentId);
        if (content is null)
            return ExecutionResult.Failed;

        db.Likes.Add(new Like
        {
            UserId = likerId,
            ContentId = contentId,
            CreatedAt = DateTime.UtcNow
        });

        db.Notifications.Add(new Notification
        {
            UserId = content.OwnerId,
            Type = NotificationType.Like,
            ActorId = likerId,
            EntityId = contentId,
            EntityType = "Content",
            Title = "liked your content",
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();
        return ExecutionResult.Success;
    }
}
