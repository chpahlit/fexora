using System.ComponentModel.DataAnnotations;

namespace Fexora.Core.DTOs.Auth;

public class PasswordResetRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
}

public class PasswordResetConfirmRequest
{
    [Required]
    public string Token { get; set; } = string.Empty;

    [Required, MinLength(8)]
    public string NewPassword { get; set; } = string.Empty;
}
