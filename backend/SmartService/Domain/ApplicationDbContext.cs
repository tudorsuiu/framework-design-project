using Microsoft.EntityFrameworkCore;
using SmartService.Domain.Entities;

namespace SmartService.Domain
{
    public class ApplicationDbContext:DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<Bill> Bills { get; set; }
        public DbSet<Reparation> Reparations { get; set; }

        public ApplicationDbContext(DbContextOptions options) : base(options) 
        { 
        
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Car>()
                .HasOne(c => c.User) 
                .WithMany(u => u.Cars) 
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.NoAction); 

            modelBuilder.Entity<Reparation>()
                .HasOne(r => r.User) 
                .WithMany(u => u.Reparations) 
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.NoAction); 

            modelBuilder.Entity<Reparation>()
                .HasOne(r => r.Mechanic) 
                .WithMany() 
                .HasForeignKey(r => r.MechanicId)
                .OnDelete(DeleteBehavior.NoAction); 

            modelBuilder.Entity<Reparation>()
                .HasOne(r => r.Car) 
                .WithMany(c => c.Reparations) 
                .HasForeignKey(r => r.CarId)
                .OnDelete(DeleteBehavior.Cascade); 
 
            modelBuilder.Entity<Bill>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bills)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Bill>()
                .HasOne(b => b.Reparation)
                .WithOne(r => r.Bill)
                .HasForeignKey<Bill>(b => b.ReparationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
