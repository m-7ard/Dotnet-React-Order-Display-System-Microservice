namespace Api.ApiModels;

public class ProductHistoryApiModel
{
    public ProductHistoryApiModel(string id, string name, List<string> images, string description, decimal price, string productId, DateTime validFrom, DateTime? validTo)
    {
        Id = id;
        Name = name;
        Images = images;
        Description = description;
        Price = price;
        ProductId = productId;
        ValidFrom = validFrom;
        ValidTo = validTo;
    }

    public string Id { get; private set; }
    public string Name { get; set; }
    public List<string> Images { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string ProductId { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
}