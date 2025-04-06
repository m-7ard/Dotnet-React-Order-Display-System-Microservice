using OneOf;

namespace Domain.ValueObjects.Shared;

public class Quantity : ValueObject
{
    private Quantity(int value)
    {
        Value = value;
    }

    public int Value { get; }

    public static OneOf<bool, string> CanCreate(int value)
    {
        if (value < 0)
        {
            return "Quantity must be greater than or equals 0.";
        }

        return true;
    }

    public static Quantity ExecuteCreate(int value)
    {
        var canCreateResult = CanCreate(value);
        if (canCreateResult.TryPickT1(out var error, out _))
        {
            throw new Exception(error);
        }

        return new Quantity(value);
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