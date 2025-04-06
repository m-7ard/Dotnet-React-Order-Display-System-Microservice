using OneOf;

namespace Domain.ValueObjects.ProductHistory;

public class ProductHistoryId : ValueObject
{
    private ProductHistoryId(Guid value)
    {
        Value = value;
    }

    public Guid Value { get; }

    public static OneOf<bool, string> CanCreate(Guid value)
    {
        return true;
    }

    public static ProductHistoryId ExecuteCreate(Guid value)
    {
        return new ProductHistoryId(value);
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