namespace Fexora.Core.DTOs.Admin;

public class PolicyConfigResponse
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class UpdatePolicyRequest
{
    public string Value { get; set; } = string.Empty;
}
