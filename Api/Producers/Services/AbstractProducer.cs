using System.Text.Json;
using Confluent.Kafka;

namespace Api.Producers.Services;

public abstract class AbstractProducer
{
    protected readonly IProducer<Null, string> _producer;
    protected readonly string TopicName;

    protected AbstractProducer(string topicName, IConfiguration configuration)
    {
        var config = new ProducerConfig
        {
            BootstrapServers = configuration["Kafka:BootstrapServers"]
        };

        _producer = new ProducerBuilder<Null, string>(config).Build();
        TopicName = topicName;
    }

    protected async Task PublishEvent<T>(AbstractEvent<T> producerEvent)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var message = JsonSerializer.Serialize(producerEvent, options);

        await _producer.ProduceAsync(TopicName, new Message<Null, string>
        {
            Value = message
        });
    }
}