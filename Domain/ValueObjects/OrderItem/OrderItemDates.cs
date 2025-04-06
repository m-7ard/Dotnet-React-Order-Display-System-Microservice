using OneOf;

namespace Domain.ValueObjects.OrderItem;

public class OrderItemDates
{
    public OrderItemDates(DateTime dateCreated, DateTime? dateFinished)
    {
        DateCreated = dateCreated;
        DateFinished = dateFinished;
    }

    public DateTime DateCreated { get; }
    public DateTime? DateFinished { get; }

    public static OneOf<bool, string> CanCreate(DateTime dateCreated, DateTime? dateFinished)
    {
        if (dateCreated > DateTime.UtcNow)
        {
            return "Date created cannot be larger than current date.";
        }

        if (dateFinished is not null && dateFinished < dateCreated)
        {
            return "Date finished cannot be smaller than date created";
        }

        return true;
    }

    public static OrderItemDates ExecuteCreate(DateTime dateCreated, DateTime? dateFinished)
    {
        var canCreateResult = CanCreate(dateCreated, dateFinished);
        if (canCreateResult.TryPickT1(out var error, out var _))
        {
            throw new Exception(error);
        }

        return new OrderItemDates(dateCreated: dateCreated, dateFinished: dateFinished);
    }
}