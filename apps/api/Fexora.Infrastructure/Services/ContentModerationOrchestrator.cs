using System.Text.Json;
using Fexora.Core.DTOs.Moderation;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Fexora.Infrastructure.Services;

public class ContentModerationOrchestrator(
    ITextModerationService textModeration,
    IImageModerationService imageModeration,
    FexoraDbContext db,
    ILogger<ContentModerationOrchestrator> logger
) : IContentModerationOrchestrator
{
    public async Task<ModerationResult> AnalyzeContentAsync(Guid contentId, CancellationToken ct = default)
    {
        var content = await db.Contents.FindAsync([contentId], ct);
        if (content == null)
        {
            logger.LogWarning("Content {ContentId} not found for moderation", contentId);
            return new ModerationResult { Flags = ["content_not_found"] };
        }

        var results = new List<ModerationResult>();

        // Text moderation (title + review comment as description proxy)
        if (!string.IsNullOrWhiteSpace(content.Title))
        {
            var textResult = await textModeration.AnalyzeTextAsync(new TextModerationRequest
            {
                Text = content.Title + (content.ReviewComment != null ? $"\n\n{content.ReviewComment}" : ""),
                Context = $"Content type: {content.Type}, Price: {content.PriceCredits} Flames"
            }, ct);
            results.Add(textResult);
        }

        // Image/Video moderation
        if (content.Type is ContentType.Image or ContentType.Video && !string.IsNullOrEmpty(content.MediaUrl))
        {
            var imageResult = await imageModeration.AnalyzeImageAsync(new ImageModerationRequest
            {
                ImageUrl = content.MediaUrl,
                Title = content.Title
            }, ct);
            results.Add(imageResult);
        }

        // Audio → text moderation (analyze title/context only, full transcription is a future feature)
        if (content.Type == ContentType.Audio)
        {
            var audioTextResult = await textModeration.AnalyzeTextAsync(new TextModerationRequest
            {
                Text = content.Title,
                Context = "Audio content - title analysis only. Full audio transcription pending."
            }, ct);
            results.Add(audioTextResult);
        }

        // Merge results: take highest score, combine flags and categories
        var merged = MergeResults(results);

        // Persist to entity
        content.AiScore = merged.Score;
        content.AiFskRating = merged.FskRating;
        content.AiFlags = merged.Flags.Count > 0 ? JsonSerializer.Serialize(merged.Flags) : null;
        content.AiAnalyzedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        logger.LogInformation(
            "Content {ContentId} moderated: score={Score}, fsk={Fsk}, flags={Flags}",
            contentId, merged.Score, merged.FskRating, string.Join(", ", merged.Flags));

        return merged;
    }

    public async Task<ModerationResult> AnalyzeChatMessageAsync(string text, CancellationToken ct = default)
    {
        return await textModeration.AnalyzeTextAsync(new TextModerationRequest
        {
            Text = text,
            Context = "Chat message between users on adult content platform"
        }, ct);
    }

    private static ModerationResult MergeResults(List<ModerationResult> results)
    {
        if (results.Count == 0)
            return new ModerationResult();

        return new ModerationResult
        {
            Score = results.Max(r => r.Score),
            FskRating = results
                .Select(r => r.FskRating)
                .OrderByDescending(f => f switch { "18+" => 3, "16+" => 2, "12+" => 1, _ => 0 })
                .First(),
            Categories = results
                .SelectMany(r => r.Categories)
                .GroupBy(c => c.Name)
                .Select(g => new ModerationCategory { Name = g.Key, Score = g.Max(c => c.Score) })
                .ToList(),
            Flags = results.SelectMany(r => r.Flags).Distinct().ToList(),
            Provider = string.Join("+", results.Select(r => r.Provider).Distinct()),
            AnalyzedAt = DateTime.UtcNow
        };
    }
}
