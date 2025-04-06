using System.ComponentModel.DataAnnotations;
using OneOf;

namespace Domain.ValueObjects.ProductHistory;

public class ProductHistoryValidityRange : ValueObject
{
    private ProductHistoryValidityRange(DateTime validFrom, DateTime? validTo)
    {
        ValidFrom = validFrom;
        ValidTo = validTo;
    }

    public DateTime ValidFrom { get; }
    public DateTime? ValidTo { get; }

    public static ProductHistoryValidityRange New()
    {
        return ExecuteCreate(validFrom: DateTime.UtcNow, null);
    }

    public static OneOf<bool, string> CanCreate(DateTime validFrom, DateTime? validTo)
    {
        if (validFrom > DateTime.UtcNow)
        {
            return $"Valid from ({validFrom}) cannot be greater than current date.";
        }
    
        if (validTo is not null && validFrom >= validTo)
        {
            return $"Valid to ({validTo}) must be greater than valid from ({validFrom}).";
        }

        return true;
    }

    public static ProductHistoryValidityRange ExecuteCreate(DateTime validFrom, DateTime? validTo)
    {
        var canCreateResult = CanCreate(validFrom, validTo);
        if (canCreateResult.TryPickT1(out var error, out _))
        {
            throw new Exception(error);
        }

        return new ProductHistoryValidityRange(validFrom, validTo);
    }

    public override IEnumerable<object> GetEqualityComponents()
    {
        yield return ValidFrom;
        yield return ValidTo ?? DateTime.MaxValue;
    }
}