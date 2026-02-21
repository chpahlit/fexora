namespace Fexora.Core.DTOs.Admin;

public class ReportResponse
{
    public Guid Id { get; set; }
    public Guid ReporterId { get; set; }
    public string ReporterUsername { get; set; } = string.Empty;
    public Guid? TargetUserId { get; set; }
    public string? TargetUsername { get; set; }
    public Guid? TargetContentId { get; set; }
    public string? TargetContentTitle { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ReviewedByUsername { get; set; }
    public string? ReviewNote { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}

public class CreateReportRequest
{
    public Guid? TargetUserId { get; set; }
    public Guid? TargetContentId { get; set; }
    public Guid? TargetMessageId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class ResolveReportRequest
{
    public string Status { get; set; } = string.Empty; // Resolved or Dismissed
    public string? ReviewNote { get; set; }
}
