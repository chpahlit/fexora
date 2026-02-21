namespace Fexora.Core.Entities;

public class Profile
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public int? Age { get; set; }
    public string? Country { get; set; }
    public string[] Badges { get; set; } = [];
    public bool OffersCustom { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
