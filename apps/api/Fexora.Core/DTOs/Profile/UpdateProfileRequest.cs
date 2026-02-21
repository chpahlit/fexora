using System.ComponentModel.DataAnnotations;

namespace Fexora.Core.DTOs.Profile;

public class UpdateProfileRequest
{
    [MinLength(3), MaxLength(30)]
    public string? Username { get; set; }

    public int? Age { get; set; }
    public string? Country { get; set; }
    public bool? OffersCustom { get; set; }

    [MaxLength(500)]
    public string? Bio { get; set; }
}
