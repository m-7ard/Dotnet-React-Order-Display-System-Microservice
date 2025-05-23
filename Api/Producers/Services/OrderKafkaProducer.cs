using Api.ApiModels;
using Api.Producers.Events;
using Confluent.Kafka;

namespace Api.Producers.Services;

public class OrderKafkaProducer : AbstractProducer
{
    private readonly ILogger<OrderKafkaProducer> _logger;

    public OrderKafkaProducer(ILogger<OrderKafkaProducer> logger, IConfiguration configuration) : base("orders", configuration)
    {

        _logger = logger;
    }

    public async Task PublishOrderCreated(OrderApiModel order, string userId)
    {
        try {
            var producerEvent = new CreateOrderEvent(payload: new CreateOrderEventPayload(order: order, userId: userId));
            await PublishEvent(producerEvent);
        } 
        catch (ProduceException<Null, string> ex)
        {
            _logger.LogError("Failed to send order event: {REASON}", ex.Error.Reason);
        }
    }

    public async Task PublishOrderUpdated(OrderApiModel order, string userId)
    {
        try {
            var producerEvent = new UpdateOrderEvent(payload: new UpdateOrderEventPayload(order: order, userId: userId));
            await PublishEvent(producerEvent);
        } 
        catch (ProduceException<Null, string> ex)
        {
            _logger.LogError("Failed to send order event: {REASON}", ex.Error.Reason);
        }
    }
}