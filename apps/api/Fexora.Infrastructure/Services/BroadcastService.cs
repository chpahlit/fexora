using Fexora.Core.DTOs;
using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class BroadcastService(
    FexoraDbContext db,
    ITargetingService targetingService,
    ITemplateService templateService,
    IComplianceService complianceService,
    IRateLimitService rateLimitService) : IBroadcastService
{
    public async Task<Broadcast> CreateAsync(string name, string targetingQueryJson, Guid senderProfileId, bool isDryRun)
    {
        var estimatedSize = await targetingService.PreviewSegmentSizeAsync(targetingQueryJson);
        var broadcast = new Broadcast
        {
            Name = name,
            TargetingQueryJson = targetingQueryJson,
            SenderProfileId = senderProfileId,
            EstimatedRecipients = estimatedSize,
            IsDryRun = isDryRun
        };
        db.Add(broadcast);
        await db.SaveChangesAsync();
        return broadcast;
    }

    public async Task<Broadcast?> GetAsync(Guid id)
    {
        return await db.Set<Broadcast>()
            .Include(b => b.Variants)
            .Include(b => b.Executions)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<PaginatedResult<Broadcast>> ListAsync(int page, int pageSize)
    {
        var query = db.Set<Broadcast>().Include(b => b.Variants).OrderByDescending(b => b.CreatedAt);
        var total = await query.CountAsync();
        var data = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PaginatedResult<Broadcast> { Data = data, Total = total, Page = page, PageSize = pageSize };
    }

    public async Task AddVariantAsync(Guid broadcastId, Guid templateId, string variantName, int weightPercent)
    {
        var broadcast = await db.Set<Broadcast>().FindAsync(broadcastId)
            ?? throw new ArgumentException("Broadcast not found.");

        var variant = new BroadcastVariant
        {
            BroadcastId = broadcastId,
            TemplateId = templateId,
            VariantName = variantName,
            WeightPercent = weightPercent
        };
        db.Add(variant);
        await db.SaveChangesAsync();
    }

    public async Task ScheduleAsync(Guid id, DateTime? scheduledAt)
    {
        var broadcast = await db.Set<Broadcast>().Include(b => b.Variants).FirstOrDefaultAsync(b => b.Id == id)
            ?? throw new ArgumentException("Broadcast not found.");

        if (broadcast.Variants.Count == 0)
            throw new InvalidOperationException("Broadcast must have at least one variant.");

        broadcast.ScheduledAt = scheduledAt ?? DateTime.UtcNow;
        broadcast.Status = BroadcastStatus.Scheduled;
        await db.SaveChangesAsync();
    }

    public async Task AbortAsync(Guid id)
    {
        var broadcast = await db.Set<Broadcast>().FindAsync(id)
            ?? throw new ArgumentException("Broadcast not found.");
        broadcast.Status = BroadcastStatus.Aborted;
        broadcast.CompletedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    public async Task<BroadcastVariant?> GetWinnerAsync(Guid broadcastId)
    {
        var variants = await db.Set<BroadcastVariant>()
            .Where(v => v.BroadcastId == broadcastId)
            .ToListAsync();

        if (variants.Count == 0) return null;

        // Winner = highest response rate
        return variants
            .OrderByDescending(v => v.SendCount > 0 ? (double)v.ResponseCount / v.SendCount : 0)
            .First();
    }

    public async Task ProcessBatchAsync(Guid broadcastId, int batchSize = 1000)
    {
        var broadcast = await db.Set<Broadcast>()
            .Include(b => b.Variants)
            .FirstOrDefaultAsync(b => b.Id == broadcastId);

        if (broadcast is null || broadcast.Status == BroadcastStatus.Aborted) return;

        if (broadcast.Status == BroadcastStatus.Scheduled)
        {
            broadcast.Status = BroadcastStatus.Sending;
            broadcast.StartedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }

        // Check quiet hours
        if (await rateLimitService.IsQuietHoursAsync()) return;

        // Get target users not yet processed
        var allUserIds = await targetingService.GetSegmentUserIdsAsync(broadcast.TargetingQueryJson);
        var processedUserIds = await db.Set<BroadcastExecution>()
            .Where(e => e.BroadcastId == broadcastId)
            .Select(e => e.UserId)
            .ToHashSetAsync();

        var pendingUsers = allUserIds.Where(uid => !processedUserIds.Contains(uid)).Take(batchSize).ToList();

        if (pendingUsers.Count == 0)
        {
            broadcast.Status = BroadcastStatus.Completed;
            broadcast.CompletedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return;
        }

        var variants = broadcast.Variants.ToList();
        var random = new Random();

        foreach (var userId in pendingUsers)
        {
            // Compliance check
            if (!await complianceService.CanExecuteActionAsync(userId))
            {
                db.Add(new BroadcastExecution
                {
                    BroadcastId = broadcastId,
                    VariantId = variants[0].Id,
                    UserId = userId,
                    Result = ExecutionResult.OptedOut,
                    ScheduledAt = DateTime.UtcNow,
                    ExecutedAt = DateTime.UtcNow
                });
                continue;
            }

            // Select variant based on weights
            var variant = SelectVariant(variants, random);

            if (!broadcast.IsDryRun)
            {
                // Render and send message
                var user = await db.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.Id == userId);
                var sender = await db.Profiles.FirstOrDefaultAsync(p => p.UserId == broadcast.SenderProfileId);

                var variables = new Dictionary<string, string>
                {
                    ["username"] = user?.Profile?.Username ?? "there",
                    ["creator_name"] = sender?.Username ?? "Creator"
                };

                var body = await templateService.RenderAsync(variant.TemplateId, variables);

                // Get or create thread
                var thread = await db.Threads
                    .FirstOrDefaultAsync(t =>
                        (t.UserAId == broadcast.SenderProfileId && t.UserBId == userId) ||
                        (t.UserAId == userId && t.UserBId == broadcast.SenderProfileId));

                if (thread is null)
                {
                    thread = new Core.Entities.Thread
                    {
                        UserAId = broadcast.SenderProfileId,
                        UserBId = userId,
                        LastActivityAt = DateTime.UtcNow
                    };
                    db.Threads.Add(thread);
                    await db.SaveChangesAsync();
                }

                db.Messages.Add(new Message
                {
                    ThreadId = thread.Id,
                    SenderId = broadcast.SenderProfileId,
                    ReceiverId = userId,
                    Body = body,
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                });

                thread.LastActivityAt = DateTime.UtcNow;
            }

            variant.SendCount++;
            db.Add(new BroadcastExecution
            {
                BroadcastId = broadcastId,
                VariantId = variant.Id,
                UserId = userId,
                Result = ExecutionResult.Success,
                ScheduledAt = DateTime.UtcNow,
                ExecutedAt = DateTime.UtcNow
            });
        }

        await db.SaveChangesAsync();
    }

    private static BroadcastVariant SelectVariant(List<BroadcastVariant> variants, Random random)
    {
        if (variants.Count == 1) return variants[0];

        var totalWeight = variants.Sum(v => v.WeightPercent);
        var roll = random.Next(totalWeight);
        var cumulative = 0;
        foreach (var v in variants)
        {
            cumulative += v.WeightPercent;
            if (roll < cumulative) return v;
        }
        return variants[^1];
    }
}
