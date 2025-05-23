using Api.ApiModels;

namespace Api.Producers.Events;

public class CreateOrderEventPayload
{
    public OrderApiModel Order { get; set; }
    public string UserId { get; set; }

    public CreateOrderEventPayload(OrderApiModel order, string userId)
    {
        Order = order;
        UserId = userId;
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