using Domain.Contracts.Products;
using Domain.Models;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class ProductMapper
{
    public static ProductDbEntity FromDomainToDbEntity(Product domain)
    {
        return new ProductDbEntity(
            id: domain.Id.Value, 
            dateCreated: domain.DateCreated, 
            name: domain.Name,
            description: domain.Description,
            price: domain.Price.Value,
            amount: domain.Amount.Value
        );
    }

    public static Product FromDbEntityToDomain(ProductDbEntity dbEntity)
    {
        var contract = new CreateProductContract(
            id: dbEntity.Id, 
            name: dbEntity.Name,
            price: dbEntity.Price,
            description: dbEntity.Description,
            dateCreated: dbEntity.DateCreated,
            images: dbEntity.Images.Select(ProductImageMapper.ToDomain).ToList(),
            amount: dbEntity.Amount
        );

        return Product.ExecuteCreate(contract);
    }
}