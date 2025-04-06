namespace Application.Contracts.Criteria;

public class FilterProductHistoriesCriteria : IEquatable<FilterProductHistoriesCriteria>
{
    public FilterProductHistoriesCriteria(
        string? name,
        decimal? minPrice,
        decimal? maxPrice,
        string? description,
        DateTime? validFrom,
        DateTime? validTo,
        Guid? productId,
        Tuple<string, bool>? orderBy)
    {
        Name = name;
        MinPrice = minPrice;
        MaxPrice = maxPrice;
        Description = description;
        ValidFrom = validFrom;
        ValidTo = validTo;
        ProductId = productId;
        OrderBy = orderBy;
    }

    public string? Name { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Description { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
    public Guid? ProductId { get; set; }
    public Tuple<string, bool>? OrderBy { get; set; }

    // For Unit Testing
    public bool Equals(FilterProductHistoriesCriteria? other)
    {
        if (other == null)
            return false;

        return Name == other.Name &&
               MinPrice == other.MinPrice &&
               MaxPrice == other.MaxPrice &&
               Description == other.Description &&
               ValidFrom == other.ValidFrom &&
               ValidTo == other.ValidTo &&
               ProductId == other.ProductId &&
               Equals(OrderBy, other.OrderBy);
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as FilterProductHistoriesCriteria);
    }

    public override int GetHashCode()
    {
        var hash = new HashCode();
        hash.Add(Name);
        hash.Add(MinPrice);
        hash.Add(MaxPrice);
        hash.Add(Description);
        hash.Add(ValidFrom);
        hash.Add(ValidTo);
        hash.Add(ProductId);
        hash.Add(OrderBy);
        return hash.ToHashCode();
    }
}
