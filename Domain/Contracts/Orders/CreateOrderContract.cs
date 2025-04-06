using Domain.Models;

namespace Domain.Contracts.Orders;

public class CreateOrderContract
{
    public CreateOrderContract(Guid id, int serialNumber, decimal total, string status, DateTime dateCreated, DateTime? dateFinished, List<OrderItem> orderItems)
    {
        Id = id;
        SerialNumber = serialNumber;
        Total = total;
        Status = status;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
        OrderItems = orderItems;
    }

    public Guid Id { get; private set; }
    public int SerialNumber { get; private set; }
    public decimal Total { get; set; }
    public string Status { get; set; }
    public DateTime DateCreated { get; }
    public DateTime? DateFinished { get; }
    public List<OrderItem> OrderItems { get; set; }
}