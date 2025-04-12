using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SmartService.Domain.DTOs
{
    public record ReparationDTO
    {
        public int Id { get; init; }

        public int UserId { get; init; }

        public int MechanicId { get; init; }

        public int CarId { get; init; }

        public string Type { get; init; }

        public string Description { get; init; }

        public DateTime Date { get; init; }

        public string Status { get; init; }
    }
}
