using OneOf;

namespace Domain.ValueObjects.OrderItem;

public class OrderItemQuantity : ValueObject
{
    private OrderItemQuantity(int value)
    {
        Value = value;
    }

    public int Value { get; }

    public static OneOf<bool, string> CanCreate(int value)
    {
        if (value < 1)
        {
            return "OrderItemQuantity must be greater than or equals 1.";
        }

        return true;
    }

    public static OrderItemQuantity ExecuteCreate(int value)
    {
        var canCreateResult = CanCreate(value);
        if (canCreateResult.TryPickT1(out var error, out _))
        {
            throw new Exception(error);
        }

        return new OrderItemQuantity(value);
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