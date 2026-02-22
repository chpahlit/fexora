namespace Fexora.Core.Entities;

public class TrendingSnapshot
{
    public Guid Id { get; set; }
    public string EntityType { get; set; } = string.Empty; // "content", "profile", "tag"
    public Guid EntityId { get; set; }
    public string Period { get; set; } = string.Empty; // "hourly", "daily", "weekly"
    public double Score { get; set; }
    public DateTime SnapshotDate { get; set; }
}
