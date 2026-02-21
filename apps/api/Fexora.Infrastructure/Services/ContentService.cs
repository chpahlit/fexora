using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Content;
using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class ContentService(FexoraDbContext db, IStorageService storage) : IContentService
{
    private const string MediaBucket = "content";

    public async Task<ContentResponse> CreateAsync(Guid ownerId, CreateContentRequest request)
    {
        if (!Enum.TryParse<ContentType>(request.Type, true, out var contentType))
            throw new ArgumentException($"Ungültiger Content-Typ: {request.Type}");

        var content = new Content
        {
            Id = Guid.NewGuid(),
            OwnerId = ownerId,
            Type = contentType,
            Title = request.Title.Trim(),
            PriceCredits = request.PriceCredits,
            Status = ContentStatus.Draft,
            CreatedAt = DateTime.UtcNow
        };

        db.Contents.Add(content);
        await db.SaveChangesAsync();

        return await MapToResponseAsync(content);
    }

    public async Task<ContentResponse?> GetByIdAsync(Guid contentId)
    {
        var content = await db.Contents
            .Include(c => c.Owner).ThenInclude(u => u.Profile)
            .FirstOrDefaultAsync(c => c.Id == contentId);

        return content is null ? null : MapToResponse(content);
    }

    public async Task<ContentResponse> UploadMediaAsync(Guid contentId, Guid ownerId, Stream fileStream, string fileName, string contentType)
    {
        var content = await db.Contents.FindAsync(contentId)
            ?? throw new KeyNotFoundException("Content nicht gefunden.");

        if (content.OwnerId != ownerId)
            throw new UnauthorizedAccessException("Kein Zugriff auf diesen Content.");

        if (content.Status != ContentStatus.Draft)
            throw new InvalidOperationException("Medien können nur im Draft-Status hochgeladen werden.");

        var key = $"{ownerId}/{contentId}/{Guid.NewGuid()}{Path.GetExtension(fileName)}";
        var mediaUrl = await storage.UploadAsync(MediaBucket, key, fileStream, contentType);

        content.MediaUrl = mediaUrl;
        await db.SaveChangesAsync();

        return await MapToResponseAsync(content);
    }

    public async Task<ContentResponse> SubmitForReviewAsync(Guid contentId, Guid ownerId)
    {
        var content = await db.Contents.FindAsync(contentId)
            ?? throw new KeyNotFoundException("Content nicht gefunden.");

        if (content.OwnerId != ownerId)
            throw new UnauthorizedAccessException("Kein Zugriff auf diesen Content.");

        if (content.Status != ContentStatus.Draft)
            throw new InvalidOperationException("Nur Drafts können eingereicht werden.");

        if (string.IsNullOrEmpty(content.MediaUrl))
            throw new InvalidOperationException("Bitte lade zuerst Medien hoch.");

        content.Status = ContentStatus.Pending;
        await db.SaveChangesAsync();

        return await MapToResponseAsync(content);
    }

    public async Task<ContentResponse> ReviewAsync(Guid contentId, ReviewContentRequest request)
    {
        var content = await db.Contents.FindAsync(contentId)
            ?? throw new KeyNotFoundException("Content nicht gefunden.");

        if (content.Status != ContentStatus.Pending)
            throw new InvalidOperationException("Nur ausstehende Inhalte können überprüft werden.");

        content.Status = request.Approved ? ContentStatus.Approved : ContentStatus.Rejected;
        content.ReviewComment = request.Comment;
        await db.SaveChangesAsync();

        return await MapToResponseAsync(content);
    }

    public async Task<PaginatedResult<ContentResponse>> GetPendingAsync(int page, int pageSize)
    {
        var query = db.Contents
            .Include(c => c.Owner).ThenInclude(u => u.Profile)
            .Where(c => c.Status == ContentStatus.Pending)
            .OrderBy(c => c.CreatedAt);

        return await PaginateAsync(query, page, pageSize);
    }

    public async Task<PaginatedResult<ContentResponse>> GetByOwnerAsync(Guid ownerId, int page, int pageSize)
    {
        var query = db.Contents
            .Include(c => c.Owner).ThenInclude(u => u.Profile)
            .Where(c => c.OwnerId == ownerId)
            .OrderByDescending(c => c.CreatedAt);

        return await PaginateAsync(query, page, pageSize);
    }

    public async Task<PaginatedResult<ContentResponse>> GetApprovedFeedAsync(int page, int pageSize)
    {
        var query = db.Contents
            .Include(c => c.Owner).ThenInclude(u => u.Profile)
            .Where(c => c.Status == ContentStatus.Approved)
            .OrderByDescending(c => c.CreatedAt);

        return await PaginateAsync(query, page, pageSize);
    }

    private static async Task<PaginatedResult<ContentResponse>> PaginateAsync(
        IQueryable<Content> query, int page, int pageSize)
    {
        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResult<ContentResponse>
        {
            Data = items.Select(MapToResponse).ToList(),
            Total = total,
            Page = page,
            PageSize = pageSize
        };
    }

    private async Task<ContentResponse> MapToResponseAsync(Content content)
    {
        await db.Entry(content).Reference(c => c.Owner).LoadAsync();
        if (content.Owner.Profile is null)
            await db.Entry(content.Owner).Reference(u => u.Profile).LoadAsync();

        return MapToResponse(content);
    }

    private static ContentResponse MapToResponse(Content content) => new()
    {
        Id = content.Id,
        OwnerId = content.OwnerId,
        OwnerUsername = content.Owner?.Profile?.Username ?? "",
        Type = content.Type.ToString(),
        Title = content.Title,
        CoverUrl = content.CoverUrl,
        BlurPreviewUrl = content.BlurPreviewUrl,
        MediaUrl = content.MediaUrl,
        PriceCredits = content.PriceCredits,
        Status = content.Status.ToString(),
        ReviewComment = content.ReviewComment,
        CreatedAt = content.CreatedAt
    };
}
