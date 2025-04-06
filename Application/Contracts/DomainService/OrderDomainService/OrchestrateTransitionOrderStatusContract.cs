using Domain.Models;

namespace Application.Contracts.DomainService.OrderDomainService;

public class OrchestrateTransitionOrderStatusContract
{
    public Order Order;
    public string Status;
    public DateTime DateOccured;

    public OrchestrateTransitionOrderStatusContract(Order order, string status, DateTime dateOccured)
    {
        Order = order;
        Status = status;
        DateOccured = dateOccured;
    }
}