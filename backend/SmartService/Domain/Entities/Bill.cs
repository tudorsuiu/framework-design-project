using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SmartService.Domain.Entities
{
    public class Bill
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Reparation")]
        public int ReparationId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Total { get; set; }

        public User User { get; set; }
        public Reparation Reparation { get; set; }
    }
}
