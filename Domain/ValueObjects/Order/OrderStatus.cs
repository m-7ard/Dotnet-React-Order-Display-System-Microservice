using OneOf;

namespace Domain.ValueObjects.Order;

public class OrderStatus : ValueObject
{
    public static OrderStatus Pending => new OrderStatus("Pending");
    public static OrderStatus Finished => new OrderStatus("Finished");
    public static readonly List<OrderStatus> ValidStatuses = [Pending, Finished];

    public string Name { get; }

    public OrderStatus(string name)
    {   
        Name = name;
    }

    public static OneOf<OrderStatus, string> CanCreate(string value)
    {
        var status = ValidStatuses.Find(status => status.Name == value);

        if (status is null)
        {
            return $"{value} is not a valid OrderStatus";
        }

        return status;
    }

    public static OrderStatus ExecuteCreate(string value)
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