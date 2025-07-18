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
     IKafkaProducer kafkaProducer,
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

                var dto = new
                {
                    Id = measurement.Id,
                    Date = measurement.MeasureDate,
                    UpperPressure = measurement.UpperPressure,
                    LowerPressure = measurement.LowerPressure,
                    Heartbeat= measurement.Heartbeat,
                    Smoking = measurement.Smoking,
                    Alcohol = measurement.Alcohol,
                    Sport = measurement.Sport,
                    Stretching = measurement.Stretching,
                    PressureState = measurement.PressureState,
                    Message = "New pressure measurement added"
                };

                string json = JsonSerializer.Serialize(dto);
                await kafkaProducer.PublishAsync("pressure-events", json);
                await cache.RemoveAsync(_cacheKey);

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
            var dto = new
            {
                Id = request.Id,
                Date = request.MeasureDate,
                UpperPressure = request.UpperPressure,
                LowerPressure = request.LowerPressure,
                Heartbeat = request.Heartbeat,
                Smoking = request.Smoking,
                Alcohol = request.Alcohol,
                Sport = request.Sport,
                Stretching = request.Stretching,
                PressureState = request.PressureState,
                Message = $"Measurement with id{id} was updated"
            };
            await repository.UpdateAsync(id, request);
            await cache.RemoveAsync(_cacheKey);
            await cache.RemoveAsync($"pressure:{id}");
            string json = JsonSerializer.Serialize(dto);
            await kafkaProducer.PublishAsync("pressure-events", json);
        }

        public async Task DeleteMeasurementAsync(int id)
        {
            var result = await repository.DeleteAsync(id);
            if (!result)
                throw new ArgumentException($"Can't find measurement with id:{id}", nameof(id));
            await cache.RemoveAsync(_cacheKey);
            await cache.RemoveAsync($"pressure:{id}");
            var dto = new
            {
                Id = id,
                Message = $"Measurement with id{id} was deleted"
            };

            string json = JsonSerializer.Serialize(dto);
            await kafkaProducer.PublishAsync("pressure-events", json);
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