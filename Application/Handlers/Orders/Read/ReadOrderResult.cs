using Domain.Models;

namespace Application.Handlers.Orders.Read;

public class ReadOrderResult
{
    public ReadOrderResult(Order order)
    {
        Order = order;
    }

    public Order Order { get; set; }
}