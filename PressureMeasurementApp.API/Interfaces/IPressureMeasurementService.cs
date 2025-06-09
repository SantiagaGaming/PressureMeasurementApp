using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Data.Entitites;

namespace PressureMeasurementApp.API.Interfaces
{
    public interface IPressureMeasurementService
    {
        Task<IEnumerable<PressureMeasurement>> GetMeasurementsAsync(DateTime from, DateTime till);
        Task<PressureMeasurement> GetMeasurementAsync(int id);
        Task<PressureMeasurement> CreateMeasurementAsync(
            List<PressureDto> pressures, LifestyleDto lifestyle);
        Task UpdateMeasurementAsync(int id, UpdateMeasurementRequest request);
        Task DeleteMeasurementAsync(int id);
    }
}
