using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartService.Domain.DTOs
{
    public record CarDTO
    {
        public int Id { get; init; }

        public int UserId { get; init; }

        public string Brand { get; init; }

        public string Model { get; init; }

        public int FabricationYear { get; init; }

        public string LicensePlate { get; init; }
    }
}
