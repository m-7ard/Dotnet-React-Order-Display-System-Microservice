using Domain.Models;

namespace Application.Contracts.DomainService.OrderDomainService;

public class OrchestrateTransitionOrderItemStatusContract
{
    public Order Order;
    public Guid OrderItemId;
    public string Status;
    public DateTime DateOccured;

    public OrchestrateTransitionOrderItemStatusContract(Order order, Guid orderItemId, string status, DateTime dateOccured)
    {
        Order = order;
        OrderItemId = orderItemId;
        Status = status;
        DateOccured = dateOccured;
    }
}