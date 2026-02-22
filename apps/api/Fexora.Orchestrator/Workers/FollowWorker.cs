using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Orchestrator.Workers;

public class FollowWorker(FexoraDbContext db) : IActionWorker
{
    public ActionType ActionType => ActionType.Follow;

    public async Task<ExecutionResult> ExecuteAsync(ScenarioStep step, Guid userId)
    {
        if (step.SenderProfileId is null)
            return ExecutionResult.Failed;

        var followerId = step.SenderProfileId.Value;

        // Duplicate check
        var alreadyFollowing = await db.Follows
            .AnyAsync(f => f.FollowerId == followerId && f.FolloweeId == userId);
        if (alreadyFollowing)
            return ExecutionResult.Skipped;

        // Check for blocked
        var isBlocked = await db.BlockedUsers
            .AnyAsync(b => b.BlockerId == userId && b.BlockedId == followerId);
        if (isBlocked)
            return ExecutionResult.Skipped;

        db.Follows.Add(new Follow
        {
            FollowerId = followerId,
            FolloweeId = userId,
            CreatedAt = DateTime.UtcNow
        });

        db.Notifications.Add(new Notification
        {
            UserId = userId,
            Type = NotificationType.Follow,
            ActorId = followerId,
            Title = "started following you",
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();
        return ExecutionResult.Success;
    }
}
