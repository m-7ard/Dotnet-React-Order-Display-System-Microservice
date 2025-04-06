using Domain.ValueObjects.Product;

namespace Application.Contracts.Criteria;

public class FilterProductsCriteria : IEquatable<FilterProductsCriteria>
{
    public FilterProductsCriteria(
        ProductId? id,
        string? name,
        decimal? minPrice,
        decimal? maxPrice,
        string? description,
        DateTime? createdBefore,
        DateTime? createdAfter,
        Tuple<string, bool>? orderBy)
    {
        Id = id;
        Name = name;
        MinPrice = minPrice;
        MaxPrice = maxPrice;
        Description = description;
        CreatedBefore = createdBefore;
        CreatedAfter = createdAfter;
        OrderBy = orderBy;
    }

    public ProductId? Id { get; set; }
    public string? Name { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Description { get; set; }
    public DateTime? CreatedBefore { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public Tuple<string, bool>? OrderBy { get; set; }

    // For Unit Testing
    public bool Equals(FilterProductsCriteria? other)
    {
        if (other == null)
            return false;

        return Equals(Id, other.Id) &&
               Name == other.Name &&
               MinPrice == other.MinPrice &&
               MaxPrice == other.MaxPrice &&
               Description == other.Description &&
               CreatedBefore == other.CreatedBefore &&
               CreatedAfter == other.CreatedAfter &&
               Equals(OrderBy, other.OrderBy);
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as FilterProductsCriteria);
    }

    public override int GetHashCode()
    {
        var hash = new HashCode();
        hash.Add(Id);
        hash.Add(Name);
        hash.Add(MinPrice);
        hash.Add(MaxPrice);
        hash.Add(Description);
        hash.Add(CreatedBefore);
        hash.Add(CreatedAfter);
        hash.Add(OrderBy);
        return hash.ToHashCode();
    }
}
