using System.ComponentModel.DataAnnotations;

namespace Fexora.Core.DTOs.Content;

public class ReviewContentRequest
{
    [Required]
    public bool Approved { get; set; }

    [MaxLength(500)]
    public string? Comment { get; set; }
}
