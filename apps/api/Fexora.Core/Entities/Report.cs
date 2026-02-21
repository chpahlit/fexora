namespace Fexora.Core.Entities;

public enum ReportStatus
{
    Open,
    InReview,
    Resolved,
    Dismissed
}

public enum ReportReason
{
    Spam,
    Harassment,
    InappropriateContent,
    Underage,
    Scam,
    CopyrightViolation,
    Other
}

public class Report
{
    public Guid Id { get; set; }
    public Guid ReporterId { get; set; }
    public Guid? TargetUserId { get; set; }
    public Guid? TargetContentId { get; set; }
    public Guid? TargetMessageId { get; set; }
    public ReportReason Reason { get; set; }
    public string? Description { get; set; }
    public ReportStatus Status { get; set; } = ReportStatus.Open;
    public Guid? ReviewedById { get; set; }
    public string? ReviewNote { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }

    public User Reporter { get; set; } = null!;
    public User? TargetUser { get; set; }
    public Content? TargetContent { get; set; }
    public User? ReviewedBy { get; set; }
}
