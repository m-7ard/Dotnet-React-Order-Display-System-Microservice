using Domain.Models;

namespace Application.Handlers.Products.List;

public class ListProductsResult
{
    public ListProductsResult(List<Product> products)
    {
        Products = products;
    }

    public List<Product> Products { get; set; }
}