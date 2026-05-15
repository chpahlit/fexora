namespace Fexora.Core.DTOs.Moderation;

public class ModerationResult
{
    public double Score { get; set; }
    public string FskRating { get; set; } = "18+";
    public List<ModerationCategory> Categories { get; set; } = [];
    public List<string> Flags { get; set; } = [];
    public string Provider { get; set; } = string.Empty;
    public DateTime AnalyzedAt { get; set; } = DateTime.UtcNow;
}

public class ModerationCategory
{
    public string Name { get; set; } = string.Empty;
    public double Score { get; set; }
}

public class TextModerationRequest
{
    public string Text { get; set; } = string.Empty;
    public string? Context { get; set; }
}

public class ImageModerationRequest
{
    public string ImageUrl { get; set; } = string.Empty;
    public string? Title { get; set; }
}
