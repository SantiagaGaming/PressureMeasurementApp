using AutoMapper;
using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Data.Entitites;
using PressureMeasurementApp.API.Exceptions;
using PressureMeasurementApp.API.Interfaces;

namespace PressureMeasurementApp.API.Services
{
    public class PressureMeasurementService(IRepository<PressureMeasurement> repository, IPressureConverter converter,IMapper mapper) : IPressureMeasurementService
    {
        public async Task<IEnumerable<PressureMeasurement>> GetMeasurementsAsync(
            DateTime from, DateTime till)
        {
            return await repository.GetAllWithDatesAsync(from, till);
        }

        public async Task<PressureMeasurement> CreateMeasurementAsync(
            List<PressureDto> pressures, LifestyleDto lifestyle)
        {
            var measurement = converter.ConvertPressure(pressures, lifestyle);
            await repository.CreateAsync(measurement);
            return measurement;
        }

        public async Task UpdateMeasurementAsync(int id, UpdateMeasurementRequest request)
        {
            var existing = await repository.GetEntityAsync(id)
                ?? throw new MeasurementNotFoundException(id);

            var updated = mapper.Map(request, existing);
            await repository.UpdateAsync(id, updated);
        }

        public async Task DeleteMeasurementAsync(int id)
        {
            if (!await repository.DeleteAsync(id))
                throw new MeasurementNotFoundException(id);
        }

        public async Task<PressureMeasurement> GetMeasurementAsync(int id)
        {
            return await repository.GetEntityAsync(id);
        }
    }
}
