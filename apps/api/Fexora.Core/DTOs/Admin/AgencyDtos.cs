namespace Fexora.Core.DTOs.Admin;

public class AgencyResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string OwnerUsername { get; set; } = string.Empty;
    public decimal PerMessageRate { get; set; }
    public decimal RevenueSharePercent { get; set; }
    public decimal AgencyCutPercent { get; set; }
    public int ModeratorCount { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateAgencyRequest
{
    public string Name { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public decimal PerMessageRate { get; set; } = 0.05m;
    public decimal RevenueSharePercent { get; set; } = 0.10m;
    public decimal AgencyCutPercent { get; set; } = 0.20m;
}

public class UpdateAgencyRequest
{
    public string? Name { get; set; }
    public decimal? PerMessageRate { get; set; }
    public decimal? RevenueSharePercent { get; set; }
    public decimal? AgencyCutPercent { get; set; }
}

public class AgencyModeratorResponse
{
    public Guid ModeratorId { get; set; }
    public string Username { get; set; } = string.Empty;
    public decimal EffectivePerMessageRate { get; set; }
    public decimal EffectiveRevenueSharePercent { get; set; }
    public DateTime JoinedAt { get; set; }
    public bool IsActive { get; set; }
}

public class AddAgencyModeratorRequest
{
    public Guid ModeratorId { get; set; }
    public decimal? CustomPerMessageRate { get; set; }
    public decimal? CustomRevenueSharePercent { get; set; }
}
