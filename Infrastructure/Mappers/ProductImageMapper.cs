using Domain.Models;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductImage;
using Domain.ValueObjects.Shared;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class ProductImageMapper
{
    public static ProductImage ToDomain(ProductImageDbEntity source)
    {
        return new ProductImage(
            id: ProductImageId.ExecuteCreate(source.Id),
            fileName: FileName.ExecuteCreate(source.FileName),
            originalFileName: FileName.ExecuteCreate(source.OriginalFileName),
            dateCreated: source.DateCreated,
            productId: source.ProductId is null ? null : ProductId.ExecuteCreate(source.ProductId.Value),
            url: source.Url
        );
    }

    public static ProductImageDbEntity ToDbModel(ProductImage source)
    {
        return new ProductImageDbEntity(
            id: source.Id.Value,
            fileName: source.FileName.Value,
            originalFileName: source.OriginalFileName.Value,
            dateCreated: source.DateCreated,
            productId: source.ProductId is null ? null : source.ProductId.Value,
            url: source.Url
        );
    }
}