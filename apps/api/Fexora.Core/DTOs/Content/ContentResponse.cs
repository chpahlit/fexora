namespace Fexora.Core.DTOs.Content;

public class ContentResponse
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public string OwnerUsername { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? CoverUrl { get; set; }
    public string? BlurPreviewUrl { get; set; }
    public string? MediaUrl { get; set; }
    public int PriceCredits { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ReviewComment { get; set; }
    public DateTime CreatedAt { get; set; }
}
