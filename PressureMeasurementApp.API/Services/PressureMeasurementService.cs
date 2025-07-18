using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Data.Entitites;
using PressureMeasurementApp.API.Interfaces;

namespace PressureMeasurementApp.API.Services
{
    public class PressureMeasurementService(
     IRepository<PressureMeasurement> repository,
     IPressureConverter converter,
     IKafkaMessanger kafkaMessanger,
     ICacheService cache) : IPressureMeasurementService
    {
        private const string _cacheKey = "pressure:latest";
        public async Task<IEnumerable<PressureMeasurement>> GetMeasurementsAsync(
            DateTime from, DateTime till)
        {
            return await repository.GetAllWithDatesAsync(from, till);
        }

        public async Task<PressureMeasurement> CreateMeasurementAsync(
     List<PressureDto> pressures, LifestyleDto lifestyle)
        {
            try
            {
                var measurement = converter.ConvertPressure(pressures, lifestyle);
                var createResult = await repository.CreateAsync(measurement);

                await cache.RemoveAsync(_cacheKey);
                await kafkaMessanger.CreateAsync(measurement);

                return createResult;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task UpdateMeasurementAsync(int id, PressureMeasurement request)
        {
            var existing = await repository.GetEntityAsync(id)
                ?? throw new ArgumentException($"Can't find measurement with id:{id}", nameof(request));
            try
            {
                await repository.UpdateAsync(id, request);
                await cache.RemoveAsync(_cacheKey);
                await cache.RemoveAsync($"pressure:{id}");
                await kafkaMessanger.CreateAsync(request);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteMeasurementAsync(int id)
        {
            var result = await repository.DeleteAsync(id);
            if (!result)
                throw new ArgumentException($"Can't find measurement with id:{id}", nameof(id));
            try
            {
                await cache.RemoveAsync(_cacheKey);
                await cache.RemoveAsync($"pressure:{id}");
                await kafkaMessanger.RemoveAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PressureMeasurement> GetMeasurementAsync(int id)
        {
            string cacheKey = $"pressure:{id}";
            var cached = await cache.GetAsync<PressureMeasurement>(cacheKey);

            if (cached != null)
                return cached;

            var measurement = await repository.GetEntityAsync(id);
            if (measurement != null)
                await cache.SetAsync(cacheKey, measurement, TimeSpan.FromMinutes(10));

            return measurement ?? throw new Exception($"Measurement with id:{id} not found.");
        }

        public async Task<IEnumerable<PressureMeasurement>> GetLatestMeasurementsAsync()
        {
            var cached = await cache.GetAsync<IEnumerable<PressureMeasurement>>(_cacheKey);

            if (cached != null)
                return cached;

            var latest = await repository.GetLatestAsync(10);
            var list = latest.ToList();

            await cache.SetAsync(_cacheKey, list);
            return list;
        }
    }
}