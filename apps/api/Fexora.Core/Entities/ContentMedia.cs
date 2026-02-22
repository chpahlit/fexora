using Fexora.Core.Enums;

namespace Fexora.Core.Entities;

public class ContentMedia
{
    public Guid Id { get; set; }
    public Guid ContentId { get; set; }
    public ContentType MediaType { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public long? FileSizeBytes { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Content Content { get; set; } = null!;
}
