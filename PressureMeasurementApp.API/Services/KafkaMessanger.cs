using PressureMeasurementApp.API.Data.Entitites;
using PressureMeasurementApp.API.Interfaces;
using System.Text.Json;

namespace PressureMeasurementApp.API.Services
{
    public class KafkaMessanger(IKafkaProducer producer) : IKafkaMessanger
    {
        public async Task CreateAsync(PressureMeasurement measurement)
        {
            if (measurement == null)
                throw new ArgumentNullException(nameof(measurement));

            try
            {
                var measurementEvent = new
                {
                    EventId = Guid.NewGuid(),
                    EventType = "CreateMeasurement",
                    EventDate = DateTime.UtcNow,
                    Data = new
                    {
                        Id = measurement.Id,
                        Date = measurement.MeasureDate,
                        UpperPressure = measurement.UpperPressure,
                        LowerPressure = measurement.LowerPressure,
                        Description = measurement.Description,
                        Heartbeat = measurement.Heartbeat,
                        Smoking = measurement.Smoking,
                        Alcohol = measurement.Alcohol,
                        Sport = measurement.Sport,
                        Stretching = measurement.Stretching,
                        PressureState = measurement.PressureState
                    },
                    Metadata = new
                    {
                        CorrelationId = Guid.NewGuid(),
                        Source = "MeasurementService",
                        Message = $"Measurement with id {measurement.Id} was added"
                    }
                };

                await PublishEventAsync(measurementEvent);
            }
            catch (Exception ex)
            {
                throw new Exception("CreateMeasurement failed", ex);
            }
        }

        public async Task UpdateAsync(PressureMeasurement measurement)
        {
            if (measurement == null)
                throw new ArgumentNullException(nameof(measurement));

            try
            {
                var measurementEvent = new
                {
                    EventId = Guid.NewGuid(),
                    EventType = "UpdateMeasurement",
                    EventDate = DateTime.UtcNow,
                    Data = new
                    {
                        Id = measurement.Id,
                        Date = measurement.MeasureDate,
                        UpperPressure = measurement.UpperPressure,
                        LowerPressure = measurement.LowerPressure,
                        Heartbeat = measurement.Heartbeat,
                        Description = measurement.Description,
                        Smoking = measurement.Smoking,
                        Alcohol = measurement.Alcohol,
                        Sport = measurement.Sport,
                        Stretching = measurement.Stretching,
                        PressureState = measurement.PressureState
                    },
                    Metadata = new
                    {
                        CorrelationId = Guid.NewGuid(),
                        Source = "MeasurementService",
                        Message = $"Measurement with id {measurement.Id} was updated"
                    }
                };

                await PublishEventAsync(measurementEvent);
            }
            catch (Exception ex)
            {
                throw new Exception("UpdateMeasurement failed", ex);
            }
        }

        public async Task RemoveAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("Measurement ID must be positive", nameof(id));

            try
            {
                var measurementEvent = new
                {
                    EventId = Guid.NewGuid(),
                    EventType = "DeleteMeasurement",
                    EventDate = DateTime.UtcNow,
                    Data = new
                    {
                        Id = id,
                    },
                    Metadata = new
                    {
                        CorrelationId = Guid.NewGuid(),
                        Source = "MeasurementService",
                        Message = $"Measurement with id {id} was deleted"
                    }
                };

                await PublishEventAsync(measurementEvent);
            }
            catch (Exception ex)
            {
                throw new Exception("DeleteMeasurement failed", ex);
            }
        }

        private async Task PublishEventAsync(object eventData)
        {
            try
            {
                string json = JsonSerializer.Serialize(eventData, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = false
                });

                await producer.PublishAsync("pressure-events", json);

            }
            catch (JsonException jsonEx)
            {
                throw new InvalidOperationException("Failed to serialize event data", jsonEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Publishing failed",ex); 
            }
        }
    }
}
