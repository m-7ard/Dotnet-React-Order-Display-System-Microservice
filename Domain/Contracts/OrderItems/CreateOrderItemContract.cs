using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;

namespace Domain.Contracts.OrderItems;

public class CreateOrderItemContract
{
    public CreateOrderItemContract(Guid id, ProductId productId, ProductHistoryId productHistoryId, int quantity, string status, int serialNumber, DateTime dateCreated, DateTime? dateFinished)
    {
        Id = id;
        ProductId = productId;
        ProductHistoryId = productHistoryId;
        Quantity = quantity;
        Status = status;
        SerialNumber = serialNumber;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
    }

    public Guid Id { get; set; }
    public ProductId ProductId { get; set; }
    public ProductHistoryId ProductHistoryId { get; set; }
    public int Quantity { get; set; }
    public string Status { get; set; }
    public int SerialNumber { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime? DateFinished { get; set; }
}