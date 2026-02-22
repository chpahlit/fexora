using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Orchestrator.Workers;

public class MessageWorker(FexoraDbContext db, ITemplateService templateService) : IActionWorker
{
    public ActionType ActionType => ActionType.Message;

    public async Task<ExecutionResult> ExecuteAsync(ScenarioStep step, Guid userId)
    {
        if (step.SenderProfileId is null)
            return ExecutionResult.Failed;

        // Check for blocked
        var isBlocked = await db.BlockedUsers
            .AnyAsync(b => b.BlockerId == userId && b.BlockedId == step.SenderProfileId);
        if (isBlocked)
            return ExecutionResult.Skipped;

        // Get or create thread
        var senderId = step.SenderProfileId.Value;
        var thread = await db.Threads
            .FirstOrDefaultAsync(t =>
                (t.UserAId == senderId && t.UserBId == userId) ||
                (t.UserAId == userId && t.UserBId == senderId));

        if (thread is null)
        {
            thread = new Core.Entities.Thread
            {
                UserAId = senderId,
                UserBId = userId,
                LastActivityAt = DateTime.UtcNow
            };
            db.Threads.Add(thread);
            await db.SaveChangesAsync();
        }

        // Render template
        var body = "Hello!";
        if (step.TemplateId.HasValue)
        {
            var user = await db.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.Id == userId);
            var sender = await db.Profiles.FirstOrDefaultAsync(p => p.UserId == senderId);

            var variables = new Dictionary<string, string>
            {
                ["username"] = user?.Profile?.Username ?? "there",
                ["creator_name"] = sender?.Username ?? "Creator",
                ["first_name"] = user?.Profile?.Username ?? "there"
            };
            body = await templateService.RenderAsync(step.TemplateId.Value, variables);
        }

        db.Messages.Add(new Message
        {
            ThreadId = thread.Id,
            SenderId = senderId,
            ReceiverId = userId,
            Body = body,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        });

        thread.LastActivityAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return ExecutionResult.Success;
    }
}
