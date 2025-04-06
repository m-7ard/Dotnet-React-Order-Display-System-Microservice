using Domain.Models;

namespace Application.Contracts.DomainService.OrderDomainService;

public class OrchestrateAddNewOrderItemContract
{
    public Order Order;
    public Guid ProductId;
    public int Quantity;

    public OrchestrateAddNewOrderItemContract(Order order, Guid productId, int quantity)
    {
        Order = order;
        ProductId = productId;
        Quantity = quantity;
    }
}