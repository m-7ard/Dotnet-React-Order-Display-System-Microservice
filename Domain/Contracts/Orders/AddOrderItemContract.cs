using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;

namespace Domain.Contracts.Orders;

public class AddOrderItemContract
{
    public AddOrderItemContract(Guid id, ProductId productId, ProductHistoryId productHistoryId, string status, int serialNumber, DateTime dateCreated, DateTime? dateFinished, decimal total, int quantity)
    {
        Id = id;
        ProductId = productId;
        ProductHistoryId = productHistoryId;
        Status = status;
        SerialNumber = serialNumber;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
        Total = total;
        Quantity = quantity;
    }

    public Guid Id { get; set; }
    public ProductId ProductId { get; set; }
    public ProductHistoryId ProductHistoryId { get; set; }
    public string Status { get; set; }
    public int SerialNumber { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime? DateFinished { get; set; }
    public decimal Total { get; set; }
    public int Quantity { get; set; }
}