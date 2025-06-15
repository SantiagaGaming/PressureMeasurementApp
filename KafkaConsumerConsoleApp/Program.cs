using Confluent.Kafka;
using Microsoft.Extensions.Configuration;

namespace KafkaConsumerConsoleApp
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            var kafkaConfig = new ConsumerConfig
            {
                BootstrapServers = config["Kafka:BootstrapServers"],
                GroupId = "pressure-measurement-group",
                AutoOffsetReset = AutoOffsetReset.Earliest,
                EnableAutoCommit = false
            };

            using var cts = new CancellationTokenSource();
            Console.CancelKeyPress += (_, e) => {
                e.Cancel = true;
                cts.Cancel();
            };

            try
            {
                using var consumer = new ConsumerBuilder<Ignore, string>(kafkaConfig)
                    .SetErrorHandler((_, e) => {
                        if (e.IsFatal)
                            Console.WriteLine($"Fatal Kafka Error: {e.Reason}");
                    })
                    .Build();

                consumer.Subscribe("pressure-events");

                while (!cts.IsCancellationRequested)
                {
                    try
                    {
                        var result = consumer.Consume(cts.Token);
                        Console.WriteLine($"Received message: {result.Message.Value}");
                        Console.WriteLine($"Partition: {result.Partition}, Offset: {result.Offset}");
                        Console.WriteLine("----------------------------------------");
                    }
                    catch (ConsumeException e)
                    {
                        if (e.Error.IsFatal)
                            break;
                    }
                    catch (OperationCanceledException)
                    {
                        // Ignore
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine($"Unexpected error: {e.Message}");
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Fatal initialization error: {ex.Message}");
            }
        }
    }
}