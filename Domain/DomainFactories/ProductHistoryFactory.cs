using Domain.Models;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;
using Domain.ValueObjects.Shared;

namespace Domain.DomainFactories;

public class ProductHistoryFactory
{
    public static ProductHistory BuildExistingProductHistory(
        ProductHistoryId id,
        string name,
        List<string> images,
        Money price,
        ProductId productId,
        ProductHistoryValidityRange validityRange,
        string description)
    {
        return new ProductHistory(
            id: id,
            name: name,
            images: images,
            price: price,
            productId: productId,
            validityRange: validityRange,
            description: description
        );
    }

    public static ProductHistory BuildNewProductHistory(
        ProductHistoryId id,
        string name,
        List<string> images,
        Money price,
        ProductId productId,
        string description)
    {
        return new ProductHistory(
            id: id,
            name: name,
            images: images,
            price: price,
            productId: productId,
            validityRange: ProductHistoryValidityRange.New(),
            description: description
        );
    }

    public static ProductHistory BuildNewProductHistoryFromProduct(Product product)
    {
        return BuildNewProductHistory(
            id: ProductHistoryId.ExecuteCreate(Guid.NewGuid()),
            name: product.Name,
            images: product.Images.Select(image => image.Url).ToList(),
            price: product.Price,
            productId: product.Id,
            description: product.Description
        );
    }
}