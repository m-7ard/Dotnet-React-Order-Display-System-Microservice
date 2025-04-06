namespace Infrastructure.DbEntities;

public class OrderItemDbEntity
{
    public enum Statuses
    {
        Pending,
        Finished
    }

    public OrderItemDbEntity(
        Guid id,
        int quantity,
        Statuses status,
        DateTime dateCreated,
        DateTime? dateFinished,
        Guid orderId,
        Guid productHistoryId,
        Guid productId,
        int serialNumber)
    {
        Id = id;
        Quantity = quantity;
        Status = status;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
        OrderId = orderId;
        ProductHistoryId = productHistoryId;
        ProductId = productId;
        SerialNumber = serialNumber;
    }

    public Guid Id { get; private set; }
    public int SerialNumber { get; set; }
    public int Quantity { get; set; }
    public Statuses Status { get; set; }
    public DateTime DateCreated { get; private set; }
    public DateTime? DateFinished { get; set; }
    public Guid ProductId { get; set; }

    // Order FK
    public Guid OrderId { get; set; }
    public OrderDbEntity Order { get; private set; } = null!;

    // Product History FK
    public Guid ProductHistoryId { get; set; }
    public ProductHistoryDbEntity ProductHistory { get; set; } = null!;
}