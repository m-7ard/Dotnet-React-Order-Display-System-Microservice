using Application.Contracts.Criteria;
using Application.Interfaces.Persistence;
using Domain.Models;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;
using Infrastructure.DbEntities;
using Infrastructure.Interfaces;
using Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class ProductHistoryRespository : IProductHistoryRepository
{
    private readonly SimpleProductOrderServiceDbContext _dbContext;
    private readonly IProductHistoryDbEntityQueryServiceFactory _queryServiceFactory;

    public ProductHistoryRespository(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext, IProductHistoryDbEntityQueryServiceFactory queryService)
    {
        _dbContext = simpleProductOrderServiceDbContext;
        _queryServiceFactory = queryService;
    }

    public Task LazyCreateAsync(ProductHistory productHistory)
    {
        var productHistoryDbEntity = ProductHistoryMapper.ToDbModel(productHistory);
        _dbContext.ProductHistory.Add(productHistoryDbEntity);
        return Task.CompletedTask;
    }

    public async Task CreateAsync(ProductHistory productHistory)
    {
        var productHistoryDbEntity = ProductHistoryMapper.ToDbModel(productHistory);
        _dbContext.ProductHistory.Add(productHistoryDbEntity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<ProductHistory?> GetLatestByProductIdAsync(ProductId id)
    {
        var productHistoryDbEntity = await _dbContext.ProductHistory.OrderByDescending(prodHist => prodHist.ValidFrom).FirstOrDefaultAsync(prodHist => prodHist.ProductId == id.Value && prodHist.ValidTo == null);
        return productHistoryDbEntity is null ? null : ProductHistoryMapper.ToDomain(productHistoryDbEntity);
    }

    public async Task<ProductHistory?> GetByIdAsync(ProductHistoryId id)
    {
        var productHistoryDbEntity = await _dbContext.ProductHistory.FirstOrDefaultAsync(prodHist => prodHist.Id == id.Value);
        return productHistoryDbEntity is null ? null : ProductHistoryMapper.ToDomain(productHistoryDbEntity);
    }

    public async Task<List<ProductHistory>> FindAllAsync(FilterProductHistoriesCriteria criteria)
    {
        IQueryable<ProductHistoryDbEntity> query = _dbContext.ProductHistory;
        if (!string.IsNullOrEmpty(criteria.Name))
        {
            query = query.Where(item => EF.Functions.Like(item.Name, $"%{criteria.Name}%"));
        }

        if (!string.IsNullOrEmpty(criteria.Description))
        {
            query = query.Where(item => EF.Functions.Like(item.Description, $"%{criteria.Description}%"));
        }

        if (criteria.MinPrice is not null)
        {
            query = query.Where(item => item.Price >= criteria.MinPrice.Value);
        }

        if (criteria.MaxPrice is not null)
        {
            query = query.Where(item => item.Price <= criteria.MaxPrice.Value);
        }

        if (criteria.ValidFrom is not null)
        {
            query = query.Where(item => item.ValidFrom >= criteria.ValidFrom);
        }

        if (criteria.ValidTo is not null)
        {
            query = query.Where(item => item.ValidTo <= criteria.ValidTo);
        }

        if (criteria.MinPrice is not null)
        {
            query = query.Where(item => item.Price >= criteria.MinPrice.Value);
        }

        if (criteria.MaxPrice is not null)
        {
            query = query.Where(item => item.Price <= criteria.MaxPrice.Value);
        }

        if (criteria.ProductId is not null)
        {
            query = query.Where(item => item.OriginalProductId == criteria.ProductId);
        }

        var queryService = _queryServiceFactory.Create(query);
        if (criteria.OrderBy is not null)
        {
            queryService.ApplyOrderBy(criteria.OrderBy);
        }

        var dbProductHistories = await queryService.ReturnResult();
        return dbProductHistories.Select(ProductHistoryMapper.ToDomain).ToList();
    }

    public async Task UpdateAsync(ProductHistory productHistory)
    {
        await LazyUpdateAsync(productHistory);
        await _dbContext.SaveChangesAsync();
    }

    public async Task LazyUpdateAsync(ProductHistory productHistory)
    {
        var currentEntity = await _dbContext.ProductHistory.SingleAsync(prodHist => prodHist.Id == productHistory.Id.Value);
        var updatedEntity = ProductHistoryMapper.ToDbModel(productHistory);
        _dbContext.Entry(currentEntity).CurrentValues.SetValues(updatedEntity);
    }
}