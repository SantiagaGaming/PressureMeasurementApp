namespace PressureMeasurementApp.API.Interfaces
{
    public interface IKafkaProducer
    {
        Task PublishAsync(string topic, string message);
    }
}
