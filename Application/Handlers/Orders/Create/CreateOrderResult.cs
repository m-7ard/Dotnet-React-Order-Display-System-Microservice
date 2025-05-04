using Domain.ValueObjects.Order;

namespace Application.Handlers.Orders.Create;

public class CreateOrderResult
{
    public OrderId OrderId { get; set; }

    public CreateOrderResult(OrderId orderId)
    {
        OrderId = orderId;
    }
}