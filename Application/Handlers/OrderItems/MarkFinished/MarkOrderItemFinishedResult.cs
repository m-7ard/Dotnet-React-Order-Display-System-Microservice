namespace Application.Handlers.OrderItems.MarkFinished;

public class MarkOrderItemFinishedResult
{
    public MarkOrderItemFinishedResult(Guid orderId, Guid orderItemId, DateTime dateFinished)
    {
        OrderId = orderId;
        OrderItemId = orderItemId;
        DateFinished = dateFinished;
    }

    public Guid OrderId { get; set; }
    public Guid OrderItemId { get; set; }
    public DateTime DateFinished { get; set; }
}