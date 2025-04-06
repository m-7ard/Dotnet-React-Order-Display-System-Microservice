namespace Api.DTOs.Products.Create;

public class CreateProductRequestDTO
{
    public CreateProductRequestDTO(string name, decimal price, string description, List<string> images, int amount)
    {
        Name = name;
        Price = price;
        Description = description;
        Images = images;
        Amount = amount;
    }

    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public List<string> Images { get; set; }
    public int Amount { get; set; }
}