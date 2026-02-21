using Fexora.Core.Enums;

namespace Fexora.Core.Entities;

public class Content
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public ContentType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? CoverUrl { get; set; }
    public string? BlurPreviewUrl { get; set; }
    public string? MediaUrl { get; set; }
    public int PriceCredits { get; set; }
    public ContentStatus Status { get; set; } = ContentStatus.Draft;
    public string? ReviewComment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Owner { get; set; } = null!;
    public ICollection<Purchase> Purchases { get; set; } = [];
}
