using Domain.Models;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;

namespace Domain.Contracts.Orders;

public class AddNewOrderItemContract
{
    public AddNewOrderItemContract(Order order, Guid id, ProductId productId, ProductHistoryId productHistoryId, int serialNumber, decimal total, int quantity)
    {
        Order = order;
        Id = id;
        ProductId = productId;
        ProductHistoryId = productHistoryId;
        SerialNumber = serialNumber;
        Total = total;
        Quantity = quantity;
    }

    public Order Order { get; set; }
    public Guid Id { get; set; }
    public ProductId ProductId { get; set; }
    public ProductHistoryId ProductHistoryId { get; set; }
    public int SerialNumber { get; set; }
    public decimal Total { get; set; }
    public int Quantity { get; set; }
}