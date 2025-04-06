using Domain.Models;

namespace Domain.DomainEvents.Order;

public class OrderItemCreatedEvent : DomainEvent
{
    public OrderItemCreatedEvent(OrderItem payload) : base()
    {
        Payload = payload;
    }

    public OrderItem Payload { get; }
    public override string EventType => "ORDER_ITEM_CREATED";
}