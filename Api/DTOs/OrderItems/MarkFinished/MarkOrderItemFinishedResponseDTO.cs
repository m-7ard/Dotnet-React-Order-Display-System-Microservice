namespace Api.DTOs.OrderItems.MarkFinished;

public class MarkOrderItemFinishedResponseDTO
{
    public MarkOrderItemFinishedResponseDTO(string orderId, string orderItemId, DateTime dateFinished)
    {
        OrderId = orderId;
        OrderItemId = orderItemId;
        DateFinished = dateFinished;
    }

    public string OrderId { get; set; }
    public string OrderItemId { get; set; }
    public DateTime DateFinished { get; set; }
}