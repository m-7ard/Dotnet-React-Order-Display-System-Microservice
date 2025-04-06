using OneOf;

namespace Domain.ValueObjects.OrderItem;

public class OrderItemSchedule : ValueObject
{
    public OrderItemStatus Status { get; }
    public OrderItemDates Dates { get; }

    private OrderItemSchedule(OrderItemStatus status, OrderItemDates dates)
    {
        Status = status;
        Dates = dates;
    }

    private static readonly Dictionary<OrderItemStatus, Func<OrderItemDates, List<DateTime?>>> _orderStatusRequirements = new()
    {
        { OrderItemStatus.Pending, orderDates => [orderDates.DateCreated] },
        { OrderItemStatus.Finished, orderDates => [orderDates.DateCreated, orderDates.DateFinished] }
    };

    private static OneOf<bool, string> ValidateOrderSchedule(OrderItemStatus orderStatus, OrderItemDates orderDates)
    {
        var dates = _orderStatusRequirements[orderStatus].Invoke(orderDates);
        if (dates.Any(date => date is null))
        {
            return $"Invalid OrderItemSchedule; OrderDate requirement for status \"{orderStatus}\" was failed to be met.";
        }

        return true;
    } 

    public static OrderItemSchedule ExecuteCreate(OrderItemStatus status, OrderItemDates dates)
    {
        var validationResult = CanCreate(status, dates);

        if (validationResult.TryPickT1(out var error, out _))
        {
            throw new Exception(error);
        }

        return new OrderItemSchedule(status, dates);
    }

    public static OneOf<bool, string> CanCreate(OrderItemStatus status, OrderItemDates dates)
    {
        var validateOrderScheduleResult = ValidateOrderSchedule(status, dates);
        if (validateOrderScheduleResult.TryPickT1(out var error, out _))
        {
            return error;
        }

        return true;
    }

    public static OneOf<OrderItemSchedule, string> TryCreate(OrderItemStatus status, OrderItemDates dates)
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