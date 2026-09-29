using System.ComponentModel.DataAnnotations;

namespace SecureBank.Api.Models;

public class SigninRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(1)]
    public string Password { get; set; } = string.Empty;
}
