using Api.ApiModels;

namespace Api.Producers.Events;

public class UpdateOrderEventPayload
{
    public OrderApiModel Order { get; set; }

    public UpdateOrderEventPayload(OrderApiModel order)
    {
        Order = order;
    }
}

public class UpdateOrderEvent : AbstractEvent<UpdateOrderEventPayload>
{
    public override UpdateOrderEventPayload Payload { get; }

    public UpdateOrderEvent(UpdateOrderEventPayload payload) : base(ProducerEventType.OrderUpdated)
    {
        Payload = payload;
    }
}