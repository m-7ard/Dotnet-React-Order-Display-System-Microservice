namespace Application.Handlers.Orders.MarkFinished;

public class MarkOrderFinishedResult
{
    public MarkOrderFinishedResult(Guid orderId, DateTime dateFinished)
    {
        OrderId = orderId;
        DateFinished = dateFinished;
    }

    public Guid OrderId { get; set; }
    public DateTime DateFinished { get; set; }
}