namespace Fexora.Core.Entities;

public class Bundle
{
    public Guid Id { get; set; }
    public Guid CreatorId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int PriceCredits { get; set; }
    public int DiscountPercent { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Creator { get; set; } = null!;
    public ICollection<BundleContent> Contents { get; set; } = [];
}

public class BundleContent
{
    public Guid BundleId { get; set; }
    public Guid ContentId { get; set; }
    public int SortOrder { get; set; }

    public Bundle Bundle { get; set; } = null!;
    public Content Content { get; set; } = null!;
}
