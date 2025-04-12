namespace SmartService.Domain.DTOs
{
    public record ReparationCreateDTO
    {
        public int UserId { get; init; }

        public int MechanicId { get; init; }

        public int CarId { get; init; }

        public string Type { get; init; }

        public string Description { get; init; }

        public DateTime Date { get; init; }

        public string Status { get; init; }
    }
}
