using Domain.Models;

namespace Application.Handlers.Products.Read;

public class ReadProductResult
{
    public ReadProductResult(Product product)
    {
        Product = product;
    }

    public Product Product { get; set; }
}