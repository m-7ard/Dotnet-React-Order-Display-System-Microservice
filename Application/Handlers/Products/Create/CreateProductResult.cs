using Domain.ValueObjects.Product;

namespace Application.Handlers.Products.Create;

public class CreateProductResult
{
    public CreateProductResult(ProductId id)
    {
        Id = id;
    }

    public ProductId Id { get; set; }
}