using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Chat;
using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class ChatService(
    FexoraDbContext db,
    IContentModerationOrchestrator aiModeration,
    IReportService reportService
) : IChatService
{
    public async Task<List<ThreadResponse>> GetThreadsAsync(Guid userId)
    {
        var threads = await db.Threads
            .Include(t => t.UserA).ThenInclude(u => u.Profile)
            .Include(t => t.UserB).ThenInclude(u => u.Profile)
            .Include(t => t.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
            .Where(t => t.UserAId == userId || t.UserBId == userId)
            .OrderByDescending(t => t.LastActivityAt)
            .ToListAsync();

        var result = new List<ThreadResponse>();
        foreach (var thread in threads)
        {
            var otherUser = thread.UserAId == userId ? thread.UserB : thread.UserA;
            var lastMsg = thread.Messages.FirstOrDefault();
            var unreadCount = await db.Messages
                .CountAsync(m => m.ThreadId == thread.Id && m.SenderId != userId && !m.IsRead);

            result.Add(new ThreadResponse
            {
                Id = thread.Id,
                OtherUserId = otherUser.Id,
                OtherUsername = otherUser.Profile?.Username ?? "",
                OtherAvatarUrl = otherUser.Profile?.AvatarUrl,
                LastMessage = lastMsg is null ? null : MapMessage(lastMsg),
                UnreadCount = unreadCount,
                LastActivityAt = thread.LastActivityAt
            });
        }

        return result;
    }

    public async Task<PaginatedResult<MessageResponse>> GetMessagesAsync(Guid userId, Guid threadId, int page, int pageSize)
    {
        var thread = await db.Threads.FindAsync(threadId)
            ?? throw new KeyNotFoundException("Thread nicht gefunden.");

        if (thread.UserAId != userId && thread.UserBId != userId)
            throw new UnauthorizedAccessException("Kein Zugriff auf diesen Thread.");

        var query = db.Messages
            .Include(m => m.Sender).ThenInclude(u => u.Profile)
            .Where(m => m.ThreadId == threadId)
            .OrderByDescending(m => m.CreatedAt);

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResult<MessageResponse>
        {
            Data = items.Select(MapMessage).ToList(),
            Total = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<MessageResponse> SendMessageAsync(Guid senderId, SendMessageRequest request)
    {
        // Find or create thread
        var thread = await db.Threads
            .FirstOrDefaultAsync(t =>
                (t.UserAId == senderId && t.UserBId == request.ReceiverId) ||
                (t.UserAId == request.ReceiverId && t.UserBId == senderId));

        if (thread is null)
        {
            thread = new Core.Entities.Thread
            {
                Id = Guid.NewGuid(),
                UserAId = senderId,
                UserBId = request.ReceiverId,
                LastActivityAt = DateTime.UtcNow
            };
            db.Threads.Add(thread);
        }
        else
        {
            thread.LastActivityAt = DateTime.UtcNow;
        }

        var message = new Message
        {
            Id = Guid.NewGuid(),
            ThreadId = thread.Id,
            SenderId = senderId,
            ReceiverId = request.ReceiverId,
            Body = request.Body.Trim(),
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        db.Messages.Add(message);
        await db.SaveChangesAsync();

        // AI moderation on chat message (fire-and-forget, non-blocking)
        var messageId = message.Id;
        var messageBody = message.Body;
        _ = Task.Run(async () =>
        {
            try
            {
                var result = await aiModeration.AnalyzeChatMessageAsync(messageBody);
                var msg = await db.Messages.FindAsync(messageId);
                if (msg != null)
                {
                    msg.AiScore = result.Score;
                    msg.AiFlagged = result.Score > 0.7;
                    await db.SaveChangesAsync();

                    if (result.Score > 0.7)
                    {
                        await reportService.CreateReport(Guid.Empty, new Core.DTOs.Admin.CreateReportRequest
                        {
                            TargetMessageId = messageId,
                            TargetUserId = senderId,
                            Reason = "InappropriateContent",
                            Description = $"[KI-Auto-Flag] Score: {result.Score:F2}. Flags: {string.Join(", ", result.Flags)}"
                        });
                    }
                }
            }
            catch { /* AI failure must not affect chat delivery */ }
        });

        // Load sender profile for response
        await db.Entry(message).Reference(m => m.Sender).LoadAsync();
        if (message.Sender.Profile is null)
            await db.Entry(message.Sender).Reference(u => u.Profile).LoadAsync();

        return MapMessage(message);
    }

    public async Task MarkAsReadAsync(Guid userId, Guid threadId)
    {
        var unread = await db.Messages
            .Where(m => m.ThreadId == threadId && m.SenderId != userId && !m.IsRead)
            .ToListAsync();

        foreach (var msg in unread)
            msg.IsRead = true;

        await db.SaveChangesAsync();
    }

    private static MessageResponse MapMessage(Message m) => new()
    {
        Id = m.Id,
        ThreadId = m.ThreadId,
        SenderId = m.SenderId,
        SenderUsername = m.Sender?.Profile?.Username ?? "",
        Body = m.Body,
        MediaUrl = m.MediaUrl,
        IsRead = m.IsRead,
        CreatedAt = m.CreatedAt
    };
}
