using Application.Contracts.Criteria;
using Application.Interfaces.Persistence;
using Domain.DomainEvents.Product;
using Domain.Models;
using Domain.ValueObjects.Product;
using Infrastructure.DbEntities;
using Infrastructure.Interfaces;
using Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class ProductRepository : IProductRepository
{
    private readonly SimpleProductOrderServiceDbContext _dbContext;
    private readonly IProductDbEntityQueryServiceFactory _queryServiceFactory;

    private async Task PersistDomainEvents(Product product)
    {
        foreach (var domainEvent in product.DomainEvents)
        {
            if (domainEvent is ProductImageCreatedEvent productImagePendingCreationEvent)
            {
                var payload = productImagePendingCreationEvent.Payload;
                var imageEntity = ProductImageMapper.ToDbModel(payload);
                _dbContext.Add(imageEntity);
            }
            else if (domainEvent is ProductImageDeletedEvent productImagePendingDeletionEvent)
            {
                var payload = productImagePendingDeletionEvent.Payload;
                var imageEntity = await _dbContext.ProductImage.SingleAsync(image => image.Id == payload.Id.Value);
                _dbContext.Remove(imageEntity);
            }
        }

        product.ClearEvents();
    }

    public ProductRepository(SimpleProductOrderServiceDbContext productApiDbContext, IProductDbEntityQueryServiceFactory queryServiceFactory)
    {
        _dbContext = productApiDbContext;
        _queryServiceFactory = queryServiceFactory;
    }

    public async Task LazyCreateAsync(Product product)
    {
        var productDbEntity = ProductMapper.FromDomainToDbEntity(product);
        _dbContext.Add(productDbEntity);
        await PersistDomainEvents(product);
    }

    public async Task CreateAsync(Product product)
    {
        var productDbEntity = ProductMapper.FromDomainToDbEntity(product);
        _dbContext.Add(productDbEntity);
        await PersistDomainEvents(product);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Product?> GetByIdAsync(ProductId id)
    {
        var productDbEntity = await _dbContext.Product
            .Include(d => d.Images)
            .SingleOrDefaultAsync(d => d.Id == id.Value);
        return productDbEntity is null ? null : ProductMapper.FromDbEntityToDomain(productDbEntity);
    }

    public async Task<List<Product>> FilterAllAsync(FilterProductsCriteria criteria)
    {
        IQueryable<ProductDbEntity> query = _dbContext.Product.Include(d => d.Images);
        if (criteria.Id is not null)
        {
            query = query.Where(item => item.Id == criteria.Id.Value);
        }

        if (!string.IsNullOrEmpty(criteria.Name))
        {
            query = query.Where(item => EF.Functions.Like(item.Name, $"%{criteria.Name}%"));
        }

        if (!string.IsNullOrEmpty(criteria.Description))
        {
            query = query.Where(item => EF.Functions.Like(item.Description, $"%{criteria.Description}%"));
        }

        if (criteria.MinPrice.HasValue)
        {
            query = query.Where(item => item.Price >= criteria.MinPrice.Value);
        }

        if (criteria.MaxPrice.HasValue)
        {
            query = query.Where(item => item.Price <= criteria.MaxPrice.Value);
        }

        if (criteria.CreatedAfter.HasValue)
        {
            query = query.Where(item => item.DateCreated >= criteria.CreatedAfter);
        }

        if (criteria.CreatedBefore.HasValue)
        {
            query = query.Where(item => item.DateCreated <= criteria.CreatedBefore);
        }

        var queryService = _queryServiceFactory.Create(query);
        if (criteria.OrderBy is not null)
        {
            queryService.ApplyOrderBy(criteria.OrderBy);
        }

        var dbProducts = await queryService.ReturnResult();
        return dbProducts.Select(ProductMapper.FromDbEntityToDomain).ToList();
    }

    public async Task UpdateAsync(Product product)
    {
        await LazyUpdateAsync(product);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteByIdAsync(ProductId id)
    {
        await LazyDeleteByIdAsync(id);
        await _dbContext.SaveChangesAsync();
    }

    public async Task LazyDeleteByIdAsync(ProductId id)
    {
        var entity = await _dbContext.Product
            .Include(d => d.Images)
            .SingleAsync(d => d.Id == id.Value);

        foreach (var image in entity.Images)
        {
            _dbContext.Remove(image);
        }

        _dbContext.Remove(entity);
    }

    public async Task LazyUpdateAsync(Product product)
    {   
        var updatedEntity = ProductMapper.FromDomainToDbEntity(product);
        var currentEntity = await _dbContext.Product.FindAsync(updatedEntity.Id);
        if (currentEntity is null) throw new Exception($"No Product of Id \"{updatedEntity.Id}\" was found in the cache or the database.");

        _dbContext.Entry(currentEntity).CurrentValues.SetValues(updatedEntity);
        await PersistDomainEvents(product);
    }
}