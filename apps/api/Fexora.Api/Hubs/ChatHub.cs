using System.Security.Claims;
using Fexora.Core.DTOs.Chat;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Fexora.Api.Hubs;

[Authorize]
public class ChatHub(IChatService chatService) : Hub
{
    private static readonly Dictionary<string, string> OnlineUsers = new();

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();
        if (userId is not null)
        {
            OnlineUsers[userId] = Context.ConnectionId;
            await Clients.All.SendAsync("UserOnline", userId);
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        if (userId is not null)
        {
            OnlineUsers.Remove(userId);
            await Clients.All.SendAsync("UserOffline", userId);
        }
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(SendMessageRequest request)
    {
        var senderId = GetUserId();
        if (senderId is null) return;

        var message = await chatService.SendMessageAsync(Guid.Parse(senderId), request);

        // Send to receiver if online
        if (OnlineUsers.TryGetValue(request.ReceiverId.ToString(), out var connectionId))
        {
            await Clients.Client(connectionId).SendAsync("ReceiveMessage", message);
        }

        // Confirm to sender
        await Clients.Caller.SendAsync("MessageSent", message);
    }

    public async Task MarkAsRead(Guid threadId)
    {
        var userId = GetUserId();
        if (userId is null) return;

        await chatService.MarkAsReadAsync(Guid.Parse(userId), threadId);

        // Notify other user that messages were read
        var thread = await chatService.GetMessagesAsync(Guid.Parse(userId), threadId, 1, 1);
        await Clients.All.SendAsync("MessagesRead", threadId, userId);
    }

    public async Task Typing(Guid receiverId)
    {
        var userId = GetUserId();
        if (userId is null) return;

        if (OnlineUsers.TryGetValue(receiverId.ToString(), out var connectionId))
        {
            await Clients.Client(connectionId).SendAsync("UserTyping", userId);
        }
    }

    public Task<string[]> GetOnlineUsers()
    {
        return Task.FromResult(OnlineUsers.Keys.ToArray());
    }

    private string? GetUserId()
    {
        return Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}
