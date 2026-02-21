namespace Fexora.Core.DTOs.Profile;

public class ProfileResponse
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public int? Age { get; set; }
    public string? Country { get; set; }
    public string[] Badges { get; set; } = [];
    public bool OffersCustom { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
