using OneOf;

namespace Domain.ValueObjects.OrderItem;

public class OrderItemId : ValueObject
{
    private OrderItemId(Guid value)
    {
        Value = value;
    }

    public Guid Value { get; }

    public static OneOf<bool, string> CanCreate(Guid value)
    {
        return true;
    }

    public static OrderItemId ExecuteCreate(Guid value)
    {
        return new OrderItemId(value);
    }

    public override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }
    
    public override string ToString()
    {
        return Value.ToString();
    }
}