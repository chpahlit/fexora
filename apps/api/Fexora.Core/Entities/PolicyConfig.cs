namespace Fexora.Core.Entities;

public class PolicyConfig
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Guid? UpdatedById { get; set; }

    public User? UpdatedBy { get; set; }
}
