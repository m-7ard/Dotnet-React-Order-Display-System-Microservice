using OneOf;

namespace Domain.ValueObjects.OrderItem;

public class OrderItemStatus : ValueObject
{
    public static OrderItemStatus Pending => new OrderItemStatus("Pending");
    public static OrderItemStatus Finished => new OrderItemStatus("Finished");
    public static readonly List<OrderItemStatus> ValidStatuses = [Pending, Finished];

    public string Name { get; }

    public OrderItemStatus(string name)
    {
        Name = name;
    }

    public static OneOf<OrderItemStatus, string> CanCreate(string value)
    {
        var status = ValidStatuses.Find(status => status.Name == value);

        if (status is null)
        {
            return $"{value} is not a valid OrderItemStatus";
        }

        return status;
    }

    public static OrderItemStatus ExecuteCreate(string value)
    {
        var canCreateResult = CanCreate(value);

        if (canCreateResult.TryPickT1(out var error, out var status))
        {
            throw new Exception(error);
        }

        return status;
    }

    public static bool IsValid(string status)
    {
        return ValidStatuses.Exists(d => d.Name == status);
    }


    public override IEnumerable<object> GetEqualityComponents()
    {
        yield return Name;
    }
}