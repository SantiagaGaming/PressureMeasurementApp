using Confluent.Kafka;
using PressureMeasurementApp.API.Interfaces;

namespace PressureMeasurementApp.API.Services
{
    public class KafkaProducer : IKafkaProducer
    {
        private readonly IProducer<Null, string> _producer;

        public KafkaProducer(IConfiguration config)
        {
            var kafkaConfig = new ProducerConfig
            {
                BootstrapServers = config["Kafka:BootstrapServers"]
            };

            _producer = new ProducerBuilder<Null, string>(kafkaConfig).Build();
        }

        public async Task PublishAsync(string topic, string message)
        {
            await _producer.ProduceAsync(topic, new Message<Null, string> { Value = message });
        }
    }
}
