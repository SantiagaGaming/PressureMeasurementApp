using AutoMapper;
using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Data.Entitites;
using PressureMeasurementApp.API.Interfaces;
using System.Text.Json;

namespace PressureMeasurementApp.API.Services
{
    public class PressureMeasurementService(
     IRepository<PressureMeasurement> repository,
     IPressureConverter converter,
     IMapper mapper,IKafkaProducer kafkaProducer,
     ICacheService cache) : IPressureMeasurementService
    {
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
                await repository.CreateAsync(measurement);

                var dto = new
                {
                    Id = measurement.Id,
                    Date = measurement.MeasureDate,
                    UpperPressure = measurement.UpperPressure,
                    LowerPressure = measurement.LowerPressure,
                    Message = "New pressure measurement added"
                };

                string json = JsonSerializer.Serialize(dto);
                await kafkaProducer.PublishAsync("pressure-events", json);

                return measurement;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task UpdateMeasurementAsync(int id, UpdateMeasurementRequest request)
        {
            var existing = await repository.GetEntityAsync(id)
                ?? throw new ArgumentException($"Can't find measurement with id:{id}", nameof(request));
            var dto = new
            {
                Message = $"Measurement with id{id} was updated"
            };

            string json = JsonSerializer.Serialize(dto);
            await kafkaProducer.PublishAsync("pressure-events", json);
            var updated = mapper.Map(request, existing);
            await repository.UpdateAsync(id, updated);
            await cache.RemoveAsync($"pressure:{id}");
        }

        public async Task DeleteMeasurementAsync(int id)
        {
           var result = await repository.DeleteAsync(id);
            if (!result)
                throw new ArgumentException($"Can't find measurement with id:{id}", nameof(id));
            var dto = new
            {
                Message = $"Measurement with id{id} was deleted"
            };

            string json = JsonSerializer.Serialize(dto);
            await kafkaProducer.PublishAsync("pressure-events", json);
            await cache.RemoveAsync($"pressure:{id}");
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
            const string cacheKey = "pressure:latest";
            var cached = await cache.GetAsync<IEnumerable<PressureMeasurement>>(cacheKey);

            if (cached != null)
                return cached;

            var latest = await repository.GetLatestAsync(10);

            var list = latest.ToList(); 
            await cache.SetAsync(cacheKey, list);

            return list;
        }
    }
}