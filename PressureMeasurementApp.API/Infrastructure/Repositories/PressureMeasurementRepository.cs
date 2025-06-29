using PressureMeasurementApp.API.Data.Entitites;
using PressureMeasurementApp.API.Interfaces;
using PressureMeasurementApp.API.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace PressureMeasurementApp.API.Infrastructure.Repositories
{
    public class PressureMeasurementRepository : IRepository<PressureMeasurement>, IDisposable
    {
        private readonly AppDbContext _dbContext;
        private bool _disposed = false;

        public PressureMeasurementRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<PressureMeasurement> CreateAsync(PressureMeasurement item)
        {
            if (item == null) throw new ArgumentNullException(nameof(item));

            await _dbContext.PressureMeasurements.AddAsync(item);
            await SaveAsync();
            await _dbContext.Entry(item)
          .Reference(p => p.PressureState)
          .LoadAsync();
            return item;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var pressureMeasurementToDelete = await _dbContext.PressureMeasurements.FindAsync(id);
            if (pressureMeasurementToDelete != null)
            {
                _dbContext.PressureMeasurements.Remove(pressureMeasurementToDelete);
                await SaveAsync();
                return true;
            }
            return false;
        }

        public async Task<PressureMeasurement?> GetEntityAsync(int id)
        {
            return await _dbContext.PressureMeasurements
         .Include(p => p.PressureState)
         .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<PressureMeasurement>> GetAllWithDatesAsync(DateTime from, DateTime till)
        {
            return await _dbContext.PressureMeasurements
                .Where(p => p.MeasureDate >= from && p.MeasureDate <= till).Include(p => p.PressureState)
                .ToListAsync();
        }

        public async Task SaveAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync(int id, PressureMeasurement item)
        {
            var existingItem = await _dbContext.PressureMeasurements.FindAsync(id);
            if (existingItem == null)
                return false;

            _dbContext.Entry(existingItem).CurrentValues.SetValues(item);
            _dbContext.Entry(existingItem).State = EntityState.Modified;

            await SaveAsync();
            return true;
        }
        public async Task<IEnumerable<PressureMeasurement>> GetLatestAsync(int count)
        {
            return await _dbContext.PressureMeasurements
          .Include(p => p.PressureState)
          .OrderByDescending(p => p.MeasureDate)
          .Take(count)
          .ToListAsync();
        }
        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _dbContext.Dispose();
                }
                _disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}