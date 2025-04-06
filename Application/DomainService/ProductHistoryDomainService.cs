using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.DomainFactories;
using Domain.Models;
using OneOf;

namespace Application.DomainService;

public class ProductHistoryDomainService : IProductHistoryDomainService
{
    private readonly IProductHistoryRepository _productHistoryRepository;

    public ProductHistoryDomainService(IProductHistoryRepository productHistoryRepository)
    {
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OneOf<ProductHistory, string>> GetLatestProductHistoryForProduct(Product product)
    {
        var productHistory = await _productHistoryRepository.GetLatestByProductIdAsync(product.Id);
        if (productHistory is null) return $"No latest Product History for Product of id \"{product.Id}\".";

        return productHistory;
    }

    public async Task<OneOf<bool, string>> CreateInitialHistoryForProduct(Product product)
    {
        var productHistoryExists = await GetLatestProductHistoryForProduct(product);
        if (productHistoryExists.IsT0) return $"Product History for Product of Id \"{product.Id}\" already exists.";

        var productHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(product);
        await _productHistoryRepository.LazyCreateAsync(productHistory);

        return true;
    }


    public async Task<OneOf<bool, string>> InvalidateHistoryForProduct(Product product)
    {
        var productHistoryExists = await GetLatestProductHistoryForProduct(product);
        if (productHistoryExists.IsT1) return productHistoryExists.AsT1;

        var productHistory = productHistoryExists.AsT0;
        productHistory.Invalidate();

        await _productHistoryRepository.LazyUpdateAsync(productHistory);

        return true;
    }

    public async Task<OneOf<bool, string>> ToggleNewHistoryForProduct(Product product)
    {
        var productHistoryExists = await GetLatestProductHistoryForProduct(product);
        if (productHistoryExists.IsT1) return productHistoryExists.AsT1;

        var productHistory = productHistoryExists.AsT0;
        productHistory.Invalidate();
        await _productHistoryRepository.LazyUpdateAsync(productHistory);

        var newProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(product);
        await _productHistoryRepository.LazyCreateAsync(newProductHistory);
        
        return true;
    }
}