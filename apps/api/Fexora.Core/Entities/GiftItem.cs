namespace Fexora.Core.Entities;

public class GiftItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? IconUrl { get; set; }
    public int PriceCredits { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}
