using OneOf;

namespace Domain.ValueObjects.ProductImage;

public class ProductImageId : ValueObject
{
    private ProductImageId(Guid value)
    {
        Value = value;
    }

    public Guid Value { get; }

    public static OneOf<bool, string> CanCreate(Guid value)
    {
        return true;
    }

    public static ProductImageId ExecuteCreate(Guid value)
    {
        return new ProductImageId(value);
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