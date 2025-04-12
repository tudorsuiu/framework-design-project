using SmartService.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace SmartService.Domain.DTOs
{
    public record LoggedUserDTO
    {
        public int Id { get; init; }

        public string FirstName { get; init; }

        public string LastName { get; init; }

        public string Email { get; init; }

        public string PhoneNumber { get; init; }

        public string Password { get; init; }

        public string Role { get; init; }

        public ICollection<CarDTO> Cars { get; init; } = new List<CarDTO>();
        public ICollection<ReparationDTO> Reparations { get; init; } = new List<ReparationDTO>();
        public ICollection<BillDTO> Bills { get; init; } = new List<BillDTO>();
    }
}
