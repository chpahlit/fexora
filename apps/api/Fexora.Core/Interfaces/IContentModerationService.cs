using Fexora.Core.DTOs.Moderation;

namespace Fexora.Core.Interfaces;

public interface ITextModerationService
{
    Task<ModerationResult> AnalyzeTextAsync(TextModerationRequest request, CancellationToken ct = default);
}

public interface IImageModerationService
{
    Task<ModerationResult> AnalyzeImageAsync(ImageModerationRequest request, CancellationToken ct = default);
}

public interface IContentModerationOrchestrator
{
    Task<ModerationResult> AnalyzeContentAsync(Guid contentId, CancellationToken ct = default);
    Task<ModerationResult> AnalyzeChatMessageAsync(string text, CancellationToken ct = default);
}
