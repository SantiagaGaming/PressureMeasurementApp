using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PressureMeasurementApp.API.Data.Entitites;
namespace PressureMeasurementApp.API.Infrastructure.Context

{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
            Database.EnsureCreated();
        }
        public DbSet<PressureMeasurement> PressureMeasurements { get; set; }
        public DbSet<PressureState> PressureStates { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PressureState>(PressureStateConfigure);
        }
        public void PressureStateConfigure(EntityTypeBuilder<PressureState> builder)
        {
            builder.HasData(
                new PressureState { Id = 1, Name = "Low" },
                new PressureState { Id = 2, Name = "Normal" },
                new PressureState { Id = 3, Name = "High" },
                new PressureState { Id = 4, Name = "Very high" }
                );
        }
        public void PressureMeasurementsConfigure(EntityTypeBuilder<PressureMeasurement> builder)
        {
            builder.HasOne(e => e.PressureState)
                .WithMany().HasForeignKey(e => e.PressureStateId).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
