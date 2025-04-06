using Domain.Models;

namespace Domain.Contracts.Products;

public class CreateProductContract
{
    public CreateProductContract(Guid id, string name, decimal price, string description, DateTime dateCreated, int amount, List<ProductImage> images)
    {
        Id = id;
        Name = name;
        Price = price;
        Description = description;
        DateCreated = dateCreated;
        Amount = amount;
        Images = images;
    }

    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public DateTime DateCreated { get; set; }
    public int Amount { get; set; } 
    public List<ProductImage> Images { get; set; } 
}