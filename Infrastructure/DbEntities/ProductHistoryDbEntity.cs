namespace Infrastructure.DbEntities;

public class ProductHistoryDbEntity
{
    public ProductHistoryDbEntity(
        Guid id,
        string name,
        List<string> images,
        string description,
        decimal price,
        Guid? productId,
        DateTime validFrom,
        DateTime? validTo,
        Guid originalProductId)
    {
        Id = id;
        Name = name;
        Images = images;
        Description = description;
        Price = price;
        ProductId = productId;
        ValidFrom = validFrom;
        ValidTo = validTo;
        OriginalProductId = originalProductId;
    }

    public Guid Id { get; private set; }
    public string Name { get; set; } = null!;
    public List<string> Images { get; set; } = [];
    public string Description { get; set; } = null!;
    public decimal Price { get; set; }

    // Product FK
    public Guid? ProductId { get; set; }
    public ProductDbEntity? Product { get; set; }

    public Guid OriginalProductId { get; set; }
    
    public DateTime ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
}
