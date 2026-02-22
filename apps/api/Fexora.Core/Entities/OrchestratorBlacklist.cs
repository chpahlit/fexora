namespace Fexora.Core.Entities;

public class OrchestratorBlacklist
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? Reason { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
