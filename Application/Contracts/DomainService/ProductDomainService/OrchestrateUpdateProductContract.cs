namespace Application.Contracts.DomainService.ProductDomainService;

public class OrchestrateUpdateProductContract
{
    public OrchestrateUpdateProductContract(Guid id, string name, decimal price, string description)
    {
        Id = id;
        Name = name;
        Price = price;
        Description = description;
    }

    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
}