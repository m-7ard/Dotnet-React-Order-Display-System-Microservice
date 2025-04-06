namespace Api.DTOs.Orders.MarkFinished;

public class MarkOrderFinishedResponseDTO
{
    public MarkOrderFinishedResponseDTO(string orderId, DateTime dateFinished)
    {
        OrderId = orderId;
        DateFinished = dateFinished;
    }

    public string OrderId { get; set; }
    public DateTime DateFinished { get; set; }
}