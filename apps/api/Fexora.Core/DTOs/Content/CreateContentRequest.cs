using System.ComponentModel.DataAnnotations;

namespace Fexora.Core.DTOs.Content;

public class CreateContentRequest
{
    [Required]
    public string Type { get; set; } = string.Empty; // Image, Video, Audio, Text

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Range(0, 100000)]
    public int PriceCredits { get; set; }
}
