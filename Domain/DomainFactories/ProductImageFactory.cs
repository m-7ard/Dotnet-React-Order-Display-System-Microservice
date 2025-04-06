using Domain.Models;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductImage;
using Domain.ValueObjects.Shared;

namespace Domain.DomainFactories;

public class ProductImageFactory
{
    public static ProductImage BuildExistingProductImage(ProductImageId id, FileName fileName, FileName originalFileName, string url, DateTime dateCreated, ProductId? productId)
    {
        return new ProductImage(
            id: id,
            fileName: fileName,
            originalFileName: originalFileName,
            url: url,
            dateCreated: dateCreated,
            productId: productId
        );
    }

    public static ProductImage BuildNewProductImage(ProductImageId id, FileName fileName, FileName originalFileName, string url, ProductId productId)
    {
        return new ProductImage(
            id: id,
            fileName: fileName,
            originalFileName: originalFileName,
            url: url,
            dateCreated: new DateTime(),
            productId: productId
        );
    }

    public static ProductImage BuildNewProductImageFromDraftImage(DraftImage source, ProductImageId id, ProductId productId)
    {
        return BuildNewProductImage(
            id: id,
            productId: productId,
            fileName: FileName.ExecuteCreate(source.FileName.Value),
            originalFileName: FileName.ExecuteCreate(source.OriginalFileName.Value),
            url: source.Url
        );
    }
}