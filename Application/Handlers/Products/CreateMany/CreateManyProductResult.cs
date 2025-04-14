using Domain.ValueObjects.Product;

namespace Application.Handlers.Products.CreateMany;

public class CreateManyProductResult
{
    public CreateManyProductResult(List<ProductId> ids)
    {
        Ids = ids;
    }

    public List<ProductId> Ids { get; set; }
}