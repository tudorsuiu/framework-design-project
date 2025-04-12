using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SmartService.Domain.Entities
{
    public class Reparation
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [ForeignKey("Mechanic")]
        public int MechanicId { get; set; }

        [ForeignKey("Car")]
        public int CarId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Type { get; set; }

        [Required]
        [MaxLength(255)]
        public string Description { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(100)]
        public string Status { get; set; }

        public Car Car { get; set; }
        public User User { get; set; }
        public User Mechanic { get; set; }
        public Bill Bill { get; set; }
    }
}
