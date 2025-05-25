using Api.ApiModels;

namespace Api.Producers.Events;

public class UpdateOrderEventPayload
{
    public OrderApiModel Order { get; set; }
    public string UserId { get; set; }

    public UpdateOrderEventPayload(OrderApiModel order, string userId)
    {
        Order = order;
        UserId = userId;
    }
}

public class UpdateOrderEvent : AbstractEvent<UpdateOrderEventPayload>
{
    public override UpdateOrderEventPayload Payload { get; }

    public UpdateOrderEvent(UpdateOrderEventPayload payload) : base(ProductEventTypeName.OrderUpdated)
    {
        Payload = payload;
    }
}