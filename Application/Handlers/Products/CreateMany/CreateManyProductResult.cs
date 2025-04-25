using Domain.ValueObjects.Product;

namespace Application.Handlers.Products.CreateMany;

public class CreateManyProductResult
{
    public CreateManyProductResult(List<ProductId> ids)
    {
        Id = ids;
    }

    public List<ProductId> Id { get; set; }
}