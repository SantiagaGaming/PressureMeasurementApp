using Microsoft.AspNetCore.SignalR;
using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Data.Entitites;
using PressureMeasurementApp.API.Hubs;
using PressureMeasurementApp.API.Interfaces;

namespace PressureMeasurementApp.API.Services
{
    public class PressureMeasurementService : IPressureMeasurementService
    {
        private readonly IRepository<PressureMeasurement> _repository;
        private readonly IPressureConverter _converter;
        private readonly IKafkaMessanger _kafkaMessanger;
        private readonly ICacheService _cache;
        private readonly IHubContext<PressureMeasurementHub> _hubContext;

        private const string _cacheKey = "pressure:latest";

        public PressureMeasurementService(
            IRepository<PressureMeasurement> repository,
            IPressureConverter converter,
            IKafkaMessanger kafkaMessanger,
            ICacheService cache,
            IHubContext<PressureMeasurementHub> hubContext)
        {
            _repository = repository;
            _converter = converter;
            _kafkaMessanger = kafkaMessanger;
            _cache = cache;
            _hubContext = hubContext;
        }

        public async Task<IEnumerable<PressureMeasurement>> GetMeasurementsAsync(
            DateTime from, DateTime till, int userId)
        {
            var measurements = await _repository.GetAllWithDatesAsync(from, till);
            return measurements.Where(m => m.UserId == userId);
        }

        public async Task<PressureMeasurement> CreateMeasurementAsync(
            List<PressureDto> pressures, LifestyleDto lifestyle, int userId)
        {
            try
            {
                var measurement = _converter.ConvertPressure(pressures, lifestyle);
                measurement.UserId = userId; // Устанавливаем UserId
                
                var createResult = await _repository.CreateAsync(measurement);

                await _cache.RemoveAsync(_cacheKey);
                await _kafkaMessanger.CreateAsync(createResult);
                await _hubContext.Clients.All.SendAsync("MeasurementAdded", createResult);
                return createResult;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task UpdateMeasurementAsync(int id, PressureMeasurement request, int userId)
        {
            var existing = await _repository.GetEntityAsync(id)
                ?? throw new ArgumentException($"Can't find measurement with id:{id}", nameof(request));

            // Проверяем, что измерение принадлежит пользователю
            if (existing.UserId != userId)
                throw new UnauthorizedAccessException("You can only update your own measurements");

            try
            {
                request.UserId = userId; // Убеждаемся, что UserId не изменился
                await _repository.UpdateAsync(id, request);
                await _cache.RemoveAsync(_cacheKey);
                await _cache.RemoveAsync($"pressure:{id}");
                await _kafkaMessanger.CreateAsync(request);
                await _hubContext.Clients.All.SendAsync("MeasurementUpdated", request);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteMeasurementAsync(int id, int userId)
        {
            var existing = await _repository.GetEntityAsync(id);
            if (existing == null)
                throw new ArgumentException($"Can't find measurement with id:{id}", nameof(id));

            // Проверяем, что измерение принадлежит пользователю
            if (existing.UserId != userId)
                throw new UnauthorizedAccessException("You can only delete your own measurements");

            var result = await _repository.DeleteAsync(id);
            if (!result)
                throw new ArgumentException($"Can't find measurement with id:{id}", nameof(id));

            try
            {
                await _cache.RemoveAsync(_cacheKey);
                await _cache.RemoveAsync($"pressure:{id}");
                await _kafkaMessanger.RemoveAsync(id);
                await _hubContext.Clients.All.SendAsync("MeasurementDeleted", id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PressureMeasurement> GetMeasurementAsync(int id, int userId)
        {
            string cacheKey = $"pressure:{id}";
            var cached = await _cache.GetAsync<PressureMeasurement>(cacheKey);

            if (cached != null)
            {
                // Проверяем, что кэшированное измерение принадлежит пользователю
                if (cached.UserId != userId)
                    throw new UnauthorizedAccessException("You can only access your own measurements");
                return cached;
            }

            var measurement = await _repository.GetEntityAsync(id);
            if (measurement == null)
                throw new Exception($"Measurement with id:{id} not found.");

            // Проверяем, что измерение принадлежит пользователю
            if (measurement.UserId != userId)
                throw new UnauthorizedAccessException("You can only access your own measurements");

            await _cache.SetAsync(cacheKey, measurement, TimeSpan.FromMinutes(10));
            return measurement;
        }

        public async Task<IEnumerable<PressureMeasurement>> GetLatestMeasurementsAsync(int userId)
        {
            var cached = await _cache.GetAsync<IEnumerable<PressureMeasurement>>(_cacheKey);

            if (cached != null)
            {
                // Фильтруем кэшированные измерения по пользователю
                return cached.Where(m => m.UserId == userId);
            }

            var latest = await _repository.GetLatestAsync(50); // Увеличиваем лимит для лучшей фильтрации
            var userMeasurements = latest.Where(m => m.UserId == userId).Take(10).ToList();

            await _cache.SetAsync(_cacheKey, latest); // Кэшируем все, но возвращаем только пользовательские
            return userMeasurements;
        }
    }
}