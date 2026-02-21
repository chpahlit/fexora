using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Chat;

namespace Fexora.Core.Interfaces;

public interface IChatService
{
    Task<List<ThreadResponse>> GetThreadsAsync(Guid userId);
    Task<PaginatedResult<MessageResponse>> GetMessagesAsync(Guid userId, Guid threadId, int page, int pageSize);
    Task<MessageResponse> SendMessageAsync(Guid senderId, SendMessageRequest request);
    Task MarkAsReadAsync(Guid userId, Guid threadId);
}
