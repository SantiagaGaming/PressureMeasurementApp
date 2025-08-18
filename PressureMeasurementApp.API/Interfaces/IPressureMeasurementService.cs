using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Data.Entitites;

namespace PressureMeasurementApp.API.Interfaces
{
    public interface IPressureMeasurementService
    {
        Task<IEnumerable<PressureMeasurement>> GetMeasurementsAsync(DateTime from, DateTime till, int userId);
        Task<IEnumerable<PressureMeasurement>> GetLatestMeasurementsAsync(int userId);
        Task<PressureMeasurement> GetMeasurementAsync(int id, int userId);
        Task<PressureMeasurement> CreateMeasurementAsync(
            List<PressureDto> pressures, LifestyleDto lifestyle, int userId);
        Task UpdateMeasurementAsync(int id, PressureMeasurement request, int userId);
        Task DeleteMeasurementAsync(int id, int userId);
    }
}
