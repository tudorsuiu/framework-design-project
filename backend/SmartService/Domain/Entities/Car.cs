using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SmartService.Domain.Entities
{
    public class Car
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Brand { get; set; }

        [Required]
        [MaxLength(100)]
        public string Model { get; set; }

        [Required]
        public int FabricationYear { get; set; }

        [Required]
        [MaxLength(7)]
        public string LicensePlate { get; set; }

        public User User { get; set; }
        public ICollection<Reparation> Reparations { get; set; }
    }
}
