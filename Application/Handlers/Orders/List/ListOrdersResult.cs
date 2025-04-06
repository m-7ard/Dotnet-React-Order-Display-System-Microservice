using Domain.Models;

namespace Application.Handlers.Orders.List;

public class ListOrdersResult
{
    public ListOrdersResult(List<Order> orders)
    {
        Orders = orders;
    }

    public List<Order> Orders { get; set; }
}