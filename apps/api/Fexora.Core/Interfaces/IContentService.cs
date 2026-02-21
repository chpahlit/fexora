using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Content;

namespace Fexora.Core.Interfaces;

public interface IContentService
{
    Task<ContentResponse> CreateAsync(Guid ownerId, CreateContentRequest request);
    Task<ContentResponse?> GetByIdAsync(Guid contentId);
    Task<ContentResponse> UploadMediaAsync(Guid contentId, Guid ownerId, Stream fileStream, string fileName, string contentType);
    Task<ContentResponse> SubmitForReviewAsync(Guid contentId, Guid ownerId);
    Task<ContentResponse> ReviewAsync(Guid contentId, ReviewContentRequest request);
    Task<PaginatedResult<ContentResponse>> GetPendingAsync(int page, int pageSize);
    Task<PaginatedResult<ContentResponse>> GetByOwnerAsync(Guid ownerId, int page, int pageSize);
    Task<PaginatedResult<ContentResponse>> GetApprovedFeedAsync(int page, int pageSize);
}
