using OneOf;

namespace Domain.ValueObjects.Product;

public class ProductId : ValueObject
{
    private ProductId(Guid value)
    {
        Value = value;
    }

    public Guid Value { get; }

    public static OneOf<bool, string> CanCreate(Guid value)
    {
        return true;
    }

    public static ProductId ExecuteCreate(Guid value)
    {
        return new ProductId(value);
    }

    public static OneOf<ProductId, string> TryCreate(Guid value)
    {
        var canCreate = CanCreate(value);
        return canCreate.TryPickT1(out var error, out _) ? error : ExecuteCreate(value);
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