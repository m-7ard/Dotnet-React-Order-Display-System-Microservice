using Application.Contracts.Criteria;
using Domain.Models;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;

namespace Application.Interfaces.Persistence;

public interface IProductHistoryRepository
{
    Task CreateAsync(ProductHistory productHistory);
    Task LazyCreateAsync(ProductHistory productHistory);
    Task<ProductHistory?> GetLatestByProductIdAsync(ProductId id);
    Task<ProductHistory?> GetByIdAsync(ProductHistoryId id);
    Task<List<ProductHistory>> FindAllAsync(FilterProductHistoriesCriteria criteria);
    Task UpdateAsync(ProductHistory productHistory);
    Task LazyUpdateAsync(ProductHistory productHistory);
}