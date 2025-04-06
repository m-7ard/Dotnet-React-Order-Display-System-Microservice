namespace Api.ApiModels;

public class OrderApiModel
{
    public OrderApiModel(
        string id,
        decimal total,
        DateTime dateCreated,
        DateTime? dateFinished,
        List<OrderItemApiModel> orderItems,
        string status,
        int serialNumber)
    {
        Id = id;
        Total = total;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
        OrderItems = orderItems;
        Status = status;
        SerialNumber = serialNumber;
    }

    public string Id { get; private set; }
    public decimal Total { get; set; }
    public string Status { get; set; }
    public DateTime DateCreated { get; private set; }
    public DateTime? DateFinished { get; set; }
    public List<OrderItemApiModel> OrderItems { get; set; }
    public int SerialNumber { get; set; }
}