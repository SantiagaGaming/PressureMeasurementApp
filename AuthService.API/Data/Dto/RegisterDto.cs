using System.ComponentModel.DataAnnotations;

namespace AuthService.API.Data.Dto
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(6)]
        public string Password { get; set; }
        [Required]
        [Compare(nameof(Password), ErrorMessage = "Passwords are not the same")]
        public string ConfirmPassword { get; set; }
    }
}
