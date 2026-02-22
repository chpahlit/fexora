using Fexora.Core.Enums;

namespace Fexora.Core.Entities;

public class DmcaReport
{
    public Guid Id { get; set; }
    public Guid ReporterId { get; set; }
    public Guid ContentId { get; set; }
    public string OriginalUrl { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? EvidenceUrlsJson { get; set; }
    public DmcaStatus Status { get; set; } = DmcaStatus.Pending;
    public Guid? ReviewedById { get; set; }
    public string? ReviewComment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReviewedAt { get; set; }

    public User Reporter { get; set; } = null!;
    public Content Content { get; set; } = null!;
    public User? ReviewedBy { get; set; }
}
