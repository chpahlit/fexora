namespace Fexora.Core.Entities;

public class Purchase
{
    public Guid Id { get; set; }
    public Guid BuyerId { get; set; }
    public Guid ContentId { get; set; }
    public int PriceCredits { get; set; }
    public Guid? AttributedToModeratorId { get; set; }
    public int? AttributedWindowSec { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Buyer { get; set; } = null!;
    public Content Content { get; set; } = null!;
}
