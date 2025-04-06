using Domain.Models;

namespace Domain.Contracts.Products;

public class UpdateProductContract
{
    public UpdateProductContract(Guid id, string name, decimal price, string description, int amount)
    {
        Id = id;
        Name = name;
        Price = price;
        Description = description;
        Amount = amount;
    }

    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public int Amount { get; set; } 
}