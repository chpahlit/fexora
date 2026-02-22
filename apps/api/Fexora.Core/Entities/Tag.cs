namespace Fexora.Core.Entities;

public class Tag
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ContentTag> ContentTags { get; set; } = [];
}

public class ContentTag
{
    public Guid ContentId { get; set; }
    public Guid TagId { get; set; }

    public Content Content { get; set; } = null!;
    public Tag Tag { get; set; } = null!;
}
