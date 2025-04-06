using Domain.Contracts.Products;
using Domain.DomainEvents;
using Domain.DomainEvents.Product;
using Domain.DomainFactories;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductImage;
using Domain.ValueObjects.Shared;
using OneOf;

namespace Domain.Models;
public class Product
{
    public Product(
        ProductId id,
        string name,
        Money price,
        string description,
        DateTime dateCreated,
        List<ProductImage> images,
        Quantity amount)
    {
        Id = id;
        Name = name;
        Price = price;
        Description = description;
        DateCreated = dateCreated;
        Images = images;
        Amount = amount;
    }

    public ProductId Id { get; private set; }
    public string Name { get; set; }
    public Money Price { get; set; }
    public string Description { get; set; }
    public DateTime DateCreated { get; private set; }
    public List<ProductImage> Images { get; set; }
    public Quantity Amount { get; set; }

    public List<DomainEvent> DomainEvents { get; set; } = [];
    public void ClearEvents()
    {
        DomainEvents = [];
    }
    
    public const int MAX_IMAGE_LENGTH = 8;

    public OneOf<bool, string> CanAddProductImage(Guid id, string fileName, string originalFileName, string url)
    {
        var canCreateProductImageId = ProductImageId.CanCreate(id);
        if (canCreateProductImageId.TryPickT1(out var error, out var _))
        {
            return error;
        }

        var canCreateProductImageFileName = FileName.CanCreate(fileName);
        if (canCreateProductImageFileName.TryPickT1(out error, out var _))
        {
            return error;
        }

        var canCreateProductImageOriginalFileName = FileName.CanCreate(originalFileName);
        if (canCreateProductImageOriginalFileName.TryPickT1(out error, out var _))
        {
            return error;
        }

        if (Images.Count >= MAX_IMAGE_LENGTH)
        {
            return "Product cannot have more than 8 images.";
        }

        if (!url.EndsWith(fileName))
        {
            return $"Url must end with the saved filename \"{fileName}\"";
        }

        return true;
    }

    public ProductImageId ExecuteAddProductImage(Guid id, string fileName, string originalFileName, string url)
    {
        var productImageId = ProductImageId.ExecuteCreate(id);
        var productImage = ProductImageFactory.BuildNewProductImage(
            id: productImageId,
            fileName: FileName.ExecuteCreate(fileName),
            originalFileName: FileName.ExecuteCreate(originalFileName),
            url: url,
            productId: ProductId.ExecuteCreate(Id.Value)
        );

        Images.Add(productImage);
        DomainEvents.Add(new ProductImageCreatedEvent(productImage));
        return productImageId;
    }

    public ProductImage? FindProductImageByFileName(FileName productImageFileName)
    {
        return Images.Find(image => Equals(image.FileName, productImageFileName));
    }

    public ProductImage? FindProductImageById(ProductImageId productImageId)
    {
        return Images.Find(image => Equals(image.Id, productImageId));
    }

    public OneOf<ProductImage, string> TryFindProductImageById(ProductImageId productImageId)
    {
        var productImage = FindProductImageById(productImageId);
        if (productImage is null)
        {
            return $"ProductImage of Id \"{productImageId}\" does not exist on Product of Id \"${Id}\".";
        }

        return productImage;
    }

    public ProductImage ExecuteFindProductImageById(ProductImageId productImageId)
    {
        var tryFindProductImageByIdResult = TryFindProductImageById(productImageId);
        if (tryFindProductImageByIdResult.TryPickT1(out var error, out var productImage))
        {
            throw new Exception(error);
        }        

        return productImage;
    }


    public OneOf<bool, string> CanDeleteProductImage(ProductImageId productImageId)
    {
        var tryFindProductImageByIdResult = TryFindProductImageById(productImageId);
        if (tryFindProductImageByIdResult.TryPickT1(out var error, out var _))
        {
            return error;
        }

        return true;
    }

    public void ExecuteDeleteProductImage(ProductImageId productImageId)
    {
        var canDeleteProductImageResult = CanDeleteProductImage(productImageId);
        if (canDeleteProductImageResult.TryPickT1(out var error, out _))
        {
            throw new Exception(error);
        }

        var productImage = ExecuteFindProductImageById(productImageId);
        Images = Images.Where(image => image.Id != productImageId).ToList();
        DomainEvents.Add(new ProductImageDeletedEvent(productImage));
    }

    public OneOf<bool, string> CanLowerAmount(int lowerBy)
    {
        var canCreateNewAmount = Quantity.CanCreate(Amount.Value - lowerBy);
        if (canCreateNewAmount.TryPickT1(out var error, out _))
        {
            return error;
        }

        return true;
    }

    public void ExecuteLowerAmount(int lowerBy)
    {
        var canLowerResult = CanLowerAmount(lowerBy);
        if (canLowerResult.TryPickT1(out var error, out _))
        {
            throw new Exception(error);
        }

        Amount = Quantity.ExecuteCreate(Amount.Value - lowerBy);
    }

    public static OneOf<bool, string> CanCreate(CreateProductContract contract)
    {
        var canCreateId = ProductId.CanCreate(contract.Id);
        if (canCreateId.TryPickT1(out var error, out _)) return error;

        var canCreateAmount = Quantity.CanCreate(contract.Amount);
        if (canCreateAmount.TryPickT1(out error, out _)) return error;

        var canCreatePrice = Money.CanCreate(contract.Price);
        if (canCreatePrice.TryPickT1(out error, out _)) return error;

        if (contract.DateCreated > DateTime.UtcNow)
        {
            return $"DateCreated ({contract.DateCreated}) cannot be larger than current date.";
        }

        return true;
    }

    public static Product ExecuteCreate(CreateProductContract contract)
    {
        var canCreate = CanCreate(contract);
        if (canCreate.TryPickT1(out var error, out _)) throw new Exception(error);

        var id = ProductId.ExecuteCreate(contract.Id);
        var amount = Quantity.ExecuteCreate(contract.Amount);
        var price = Money.ExecuteCreate(contract.Price);

        return new Product(
            id: id,
            name: contract.Name,
            price: price,
            description: contract.Description,
            dateCreated: contract.DateCreated,
            images: contract.Images,
            amount: amount
        );
    }

    public OneOf<bool, string> CanUpdate(UpdateProductContract contract)
    {
        var canCreateId = ProductId.CanCreate(contract.Id);
        if (canCreateId.TryPickT1(out var error, out _)) return error;

        var canCreateAmount = Quantity.CanCreate(contract.Amount);
        if (canCreateAmount.TryPickT1(out error, out _)) return error;

        var canCreatePrice = Money.CanCreate(contract.Price);
        if (canCreatePrice.TryPickT1(out error, out _)) return error;

        return true;
    }

    public void ExecuteUpdate(UpdateProductContract contract)
    {
        var canUpdate = CanUpdate(contract);
        if (canUpdate.TryPickT1(out var error, out _)) throw new Exception(error);
        
        Id = ProductId.ExecuteCreate(contract.Id);
        Name = contract.Name;
        Price = Money.ExecuteCreate(contract.Price);
        Description = contract.Description;
        Amount = Quantity.ExecuteCreate(contract.Amount);
    }
}