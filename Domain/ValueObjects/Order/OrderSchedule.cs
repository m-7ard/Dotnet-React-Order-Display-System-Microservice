using OneOf;

namespace Domain.ValueObjects.Order;

public class OrderSchedule : ValueObject
{
    public OrderStatus Status { get; }
    public OrderDates Dates { get; }

    private OrderSchedule(OrderStatus status, OrderDates dates)
    {
        Status = status;
        Dates = dates;
    }

    private static readonly Dictionary<OrderStatus, Func<OrderDates, List<DateTime?>>> _orderStatusRequirements = new()
    {
        { OrderStatus.Pending, orderDates => [orderDates.DateCreated] },
        { OrderStatus.Finished, orderDates => [orderDates.DateCreated, orderDates.DateFinished] }
    };

    private static OneOf<bool, string> ValidateOrderSchedule(OrderStatus orderStatus, OrderDates orderDates)
    {
        var dates = _orderStatusRequirements[orderStatus].Invoke(orderDates);
        if (dates.Any(date => date is null))
        {
            return $"Invalid OrderSchedule; OrderDate requirement for status \"{orderStatus}\" was failed to be met.";
        }

        return true;
    } 

    public static OrderSchedule ExecuteCreate(OrderStatus status, OrderDates dates)
    {
        var validationResult = CanCreate(status, dates);

        if (validationResult.TryPickT1(out var error, out _))
        {
            throw new Exception(error);
        }

        return new OrderSchedule(status, dates);
    }

    public static OneOf<bool, string> CanCreate(OrderStatus status, OrderDates dates)
    {
        var validateOrderScheduleResult = ValidateOrderSchedule(status, dates);
        if (validateOrderScheduleResult.TryPickT1(out var error, out _))
        {
            return error;
        }

        return true;
    }

    public static OneOf<OrderSchedule, string> TryCreate(OrderStatus status, OrderDates dates)
    {
        var canCreateResult = CanCreate(status, dates);
        if (canCreateResult.TryPickT1(out var error, out _))
        {
            return error;
        }

        return ExecuteCreate(status, dates);
    }


    public override IEnumerable<object> GetEqualityComponents()
    {
        yield return Status;
        yield return Dates;
    }
}