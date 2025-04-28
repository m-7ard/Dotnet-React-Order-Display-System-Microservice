using Api.ApiModels;

namespace Api.Producers.Events;

public class CreateOrderEventPayload
{
    public OrderApiModel Order { get; set; }

    public CreateOrderEventPayload(OrderApiModel order)
    {
        Order = order;
    }
}

public class CreateOrderEvent : IEvent<CreateOrderEventPayload>
{
    public ProducerEventType Type { get; } = ProducerEventType.OrderCreated;
    public CreateOrderEventPayload Payload { get; }

    public CreateOrderEvent(CreateOrderEventPayload payload)
    {
        Payload = payload;
    }
}