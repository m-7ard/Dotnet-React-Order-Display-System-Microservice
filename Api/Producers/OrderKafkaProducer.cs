using System.Text.Json;
using Api.ApiModels;
using Application.Interfaces.Persistence;
using Confluent.Kafka;
using Domain.Models;

namespace Api.Producers;

public class OrderKafkaProducer
{
    private readonly IProducer<Null, string> _producer;
    private const string TopicName = "orders";
    private readonly ILogger<OrderKafkaProducer> _logger;

    public OrderKafkaProducer(ILogger<OrderKafkaProducer> logger)
    {
        var config = new ProducerConfig
        {
            BootstrapServers = "localhost:29092"
        };

        _producer = new ProducerBuilder<Null, string>(config).Build();
        _logger = logger;
    }

    public async Task Publish(OrderApiModel order)
    {
        try {
            var message = JsonSerializer.Serialize(order);

            await _producer.ProduceAsync(TopicName, new Message<Null, string>
            {
                Value = message
            });
        } 
        catch (ProduceException<Null, string> ex)
        {
            _logger.LogError("Failed to send order event: {REASON}", ex.Error.Reason);
        }
    }
}