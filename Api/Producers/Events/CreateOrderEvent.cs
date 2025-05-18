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

public class CreateOrderEvent : AbstractEvent<CreateOrderEventPayload>
{
    public override CreateOrderEventPayload Payload { get; }

    public CreateOrderEvent(CreateOrderEventPayload payload) : base(ProductEventTypeName.OrderCreated)
    {
        Payload = payload;
    }
}