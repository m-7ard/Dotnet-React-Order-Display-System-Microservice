using Application.Contracts.Criteria;
using Domain.Models;
using Domain.ValueObjects.Product;

namespace Application.Interfaces.Persistence;

public interface IProductRepository
{
    Task CreateAsync(Product product);
    Task LazyCreateAsync(Product product);
    Task UpdateAsync(Product product);
    Task LazyUpdateAsync(Product product);
    Task DeleteByIdAsync(ProductId id);
    Task LazyDeleteByIdAsync(ProductId id);
    Task<Product?> GetByIdAsync(ProductId id);
    Task<List<Product>> FilterAllAsync(FilterProductsCriteria criteria);
}