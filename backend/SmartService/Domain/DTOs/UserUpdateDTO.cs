namespace SmartService.Domain.DTOs
{
    using System.ComponentModel.DataAnnotations;

    namespace SmartService.Domain.DTOs
    {
        public record UserUpdateDTO
        {
            public int Id { get; init; }

            public string FirstName { get; init; }

            public string LastName { get; init; }

            public string Email { get; init; }

            public string PhoneNumber { get; init; }

            public string Password { get; init; }

            public string Role { get; init; }
        }
    }

}
