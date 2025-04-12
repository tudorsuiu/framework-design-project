namespace SmartService.Domain.DTOs
{
    public record BillDTO
    {
        public int Id { get; set; }

        public int ReparationId { get; set; }

        public int UserId { get; set; }

        public DateTime Date { get; set; }

        public decimal Total { get; set; }
    }
}
