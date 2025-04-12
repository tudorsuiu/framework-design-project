namespace SmartService.Domain.DTOs
{
    public record CarCreateDTO
    {
        public int UserId { get; init; }

        public string Brand { get; init; }

        public string Model { get; init; }

        public int FabricationYear { get; init; }

        public string LicensePlate { get; init; }
    }
}
