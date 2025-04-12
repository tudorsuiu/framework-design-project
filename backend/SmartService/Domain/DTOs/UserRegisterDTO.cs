using System.ComponentModel.DataAnnotations;

namespace SmartService.Domain.DTOs
{
    public record UserRegisterDTO
    {
        [MaxLength(100)]
        public string FirstName { get; init; }

        [MaxLength(100)]
        public string LastName { get; init; } 

        [MaxLength(255)]
        public string Email { get; init; }

        [MaxLength(10)]
        public string PhoneNumber { get; init; }

        public string Password { get; init; }

        [MaxLength(100)]
        public string Role { get; init; }
    }
}
