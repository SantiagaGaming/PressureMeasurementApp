using PressureMeasurementApp.API.Data.Entitites;

namespace PressureMeasurementApp.API.Interfaces
{
    public interface IKafkaMessanger
    {
        Task CreateAsync(PressureMeasurement measurement);
        Task UpdateAsync(PressureMeasurement measurement);
        Task RemoveAsync(int id);
    }
}
