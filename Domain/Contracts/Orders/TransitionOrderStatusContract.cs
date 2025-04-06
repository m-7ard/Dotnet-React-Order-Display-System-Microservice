namespace Domain.Contracts.Orders;

public class TransitionOrderStatusContract
{
    public TransitionOrderStatusContract(string status, DateTime dateCreated, DateTime? dateFinished)
    {
        Status = status;
        DateCreated = dateCreated;
        DateFinished = dateFinished;
    }

    public string Status { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime? DateFinished { get; set; }
}