using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;
using Domain.ValueObjects.Shared;

namespace Domain.Models;

public class ProductHistory
{
    public ProductHistory(
        ProductHistoryId id,
        string name,
        List<string> images,
        Money price,
        ProductId productId,
        string description,
        ProductHistoryValidityRange validityRange)
    {
        Id = id;
        Name = name;
        Images = images;
        Price = price;
        ProductId = productId;
        Description = description;
        ValidityRange = validityRange;
    }

    public ProductHistoryId Id { get; private set; }
    public string Name { get; set; }
    public List<string> Images { get; set; }
    public string Description { get; set; }
    public Money Price { get; set; }
    public ProductId ProductId { get; set; }
    public ProductHistoryValidityRange ValidityRange { get; set; }

    public void Invalidate()
    {
        ValidityRange = ProductHistoryValidityRange.ExecuteCreate(validFrom: ValidityRange.ValidFrom, validTo: DateTime.UtcNow);
    }

    public bool IsValid()
    {
        return ValidityRange.ValidTo is null;
    }
}