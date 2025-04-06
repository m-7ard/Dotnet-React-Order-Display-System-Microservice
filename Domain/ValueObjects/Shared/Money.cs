using OneOf;

namespace Domain.ValueObjects.Shared;

public class Money : ValueObject
{
    public readonly static Money ZeroTotal = new Money(0);

    private Money(decimal value)
    {
        Value = value;
    }

    public decimal Value { get; }

    public static OneOf<bool, string> CanCreate(decimal value)
    {
        if (value < 0)
        {
            return $"Order total ({value}) must be larger than 0.";
        }

        return true;
    }

    public static Money ExecuteCreate(decimal value)
    {
        var canCreateResult = CanCreate(value);
        if (canCreateResult.TryPickT1(out var error, out _))
        {
            throw new Exception(error);
        }

        return new Money(value);
    }

    public Money Plus(Money other)
    {
        return ExecuteCreate(Value + other.Value);
    }

    public static Money operator +(Money left, Money right)
    {
        return left.Plus(right);
    }

    public Money Multiply(decimal multiplier)
    {
        return ExecuteCreate(Value * multiplier);
    }

    public static Money operator *(Money money, decimal multiplier)
    {
        return money.Multiply(multiplier);
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