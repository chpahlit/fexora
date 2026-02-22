namespace Fexora.Core.Entities;

public class Tip
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public Guid RecipientId { get; set; }
    public int AmountCredits { get; set; }
    public string? Message { get; set; }
    public Guid? ThreadId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Sender { get; set; } = null!;
    public User Recipient { get; set; } = null!;
    public Thread? Thread { get; set; }
}
