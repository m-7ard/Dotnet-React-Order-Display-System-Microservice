using OneOf;

namespace Domain.ValueObjects.Order;

public class OrderDates
{
    public OrderDates(DateTime dateCreated, DateTime? dateFinished)
    {
        DateCreated = dateCreated;
        DateFinished = dateFinished;
    }

    public DateTime DateCreated { get; }
    public DateTime? DateFinished { get; }

    private readonly List<Func<OrderDates, DateTime?>> _orderDatesOrdering = new List<Func<OrderDates, DateTime?>>()
    {
        orderDates => orderDates.DateCreated,
        orderDates => orderDates.DateFinished
    };

    private OneOf<bool, string> ValidateDatesOrdering()
    {
        DateTime? previous = DateCreated;
        for (var i = 1; i < _orderDatesOrdering.Count; i++)
        {
            var fn = _orderDatesOrdering[i];
            var current = fn(this);
            
            if (previous is null && current is not null)
            {
                return "Invalid OrderDates: a greater date cannot be set while a lesser date is null.";
            } 
            else if (previous is not null && current is not null && previous > current)
            {
                return "Invalid OrderDates: a lesser date cannot be larger than a greater date.";
            }

            previous = current;
        }

        return true;
    }

    public static OneOf<bool, string> CanCreate(DateTime dateCreated, DateTime? dateFinished)
    {
        var currentDate = DateTime.UtcNow;
        if (dateCreated > DateTime.UtcNow)
        {
            return $"Date created ({ dateCreated }) cannot be larger than current date ({ currentDate }).";
        }

        var orderDates = new OrderDates(
            dateCreated: dateCreated,
            dateFinished: dateFinished
        );

        var validOrdering = orderDates.ValidateDatesOrdering();
        if (validOrdering.TryPickT1(out var error, out _))
        {
            return error;
        }

        return true;
    }

    public static OrderDates ExecuteCreate(DateTime dateCreated, DateTime? dateFinished)
    {
        var canCreateResult = CanCreate(dateCreated, dateFinished);
        if (canCreateResult.TryPickT1(out var error, out var _))
        {
            throw new Exception(error);
        }

        return new OrderDates(dateCreated: dateCreated, dateFinished: dateFinished);
    }
}