namespace Fexora.Core.DTOs.Admin;

public class AuditLogResponse
{
    public Guid Id { get; set; }
    public Guid ActorId { get; set; }
    public string ActorUsername { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public Guid? EntityId { get; set; }
    public string? Details { get; set; }
    public string? IpAddress { get; set; }
    public DateTime CreatedAt { get; set; }
}
