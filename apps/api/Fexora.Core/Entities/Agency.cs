namespace Fexora.Core.Entities;

public class Agency
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public decimal PerMessageRate { get; set; } = 0.05m;
    public decimal RevenueSharePercent { get; set; } = 0.10m;
    public decimal AgencyCutPercent { get; set; } = 0.20m; // Agency keeps 20% of moderator earnings
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Owner { get; set; } = null!;
    public ICollection<AgencyModerator> Moderators { get; set; } = [];
}

public class AgencyModerator
{
    public Guid AgencyId { get; set; }
    public Guid ModeratorId { get; set; }
    public decimal? CustomPerMessageRate { get; set; }
    public decimal? CustomRevenueSharePercent { get; set; }
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;

    public Agency Agency { get; set; } = null!;
    public User Moderator { get; set; } = null!;
}
