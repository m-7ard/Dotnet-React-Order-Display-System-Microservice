using Application.Contracts.Criteria;
using Application.Interfaces.Persistence;
using Domain.DomainEvents.Order;
using Domain.Models;
using Domain.ValueObjects.Order;
using Infrastructure.DbEntities;
using Infrastructure.Interfaces;
using Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class OrderRepository : IOrderRepository
{
    private readonly SimpleProductOrderServiceDbContext _dbContext;
    private readonly IOrderDbEntityQueryServiceFactory _orderDbEntityQueryServiceFactory;
    
    private async Task PersistDomainEvents(Order order)
    {
        foreach (var domainEvent in order.DomainEvents)
        {
            if (domainEvent is OrderItemCreatedEvent createEvent)
            {
                var writeEntity = OrderItemMapper.ToDbModel(order, createEvent.Payload);
                _dbContext.Add(writeEntity);
            }
            else if (domainEvent is OrderItemUpdated updateEvent)
            {
                var writeEntity = OrderItemMapper.ToDbModel(order, updateEvent.Payload);
                var trackedEntity = await _dbContext.OrderItem.SingleAsync(orderItem => orderItem.Id == writeEntity.Id);
                _dbContext.Entry(trackedEntity).CurrentValues.SetValues(writeEntity);
            }
        }

        order.ClearEvents();
    } 

    public OrderRepository(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext, IOrderDbEntityQueryServiceFactory orderDbEntityQueryServiceFactory)
    {
        _dbContext = simpleProductOrderServiceDbContext;
        _orderDbEntityQueryServiceFactory = orderDbEntityQueryServiceFactory;
    }

    public async Task CreateAsync(Order order)
    {
        await LazyCreateAsync(order);
        await _dbContext.SaveChangesAsync();
    }

    public async Task LazyCreateAsync(Order order)
    {
        var orderDbEntity = OrderMapper.ToDbModel(order);
        _dbContext.Add(orderDbEntity);
        await PersistDomainEvents(order);
    }

    public async Task<Order?> GetByIdAsync(OrderId id)
    {
        var orderDbEntity = await _dbContext.Order
            .Include(d => d.OrderItems)
            .SingleOrDefaultAsync(d => d.Id == id.Value);
            
        return orderDbEntity is null ? null : OrderMapper.ToDomain(orderDbEntity);
    }

    public async Task<List<Order>> FilterAllAsync(FilterOrdersCriteria criteria)
    {
        IQueryable<OrderDbEntity> query = _dbContext.Order.Include(d => d.OrderItems);

        if (criteria.Id is not null)
        {
            query = query.Where(order => order.Id == criteria.Id);
        }

        if (criteria.MinTotal is not null)
        {
            query = query.Where(order => order.Total >= criteria.MinTotal);
        }

        if (criteria.MaxTotal is not null)
        {
            query = query.Where(order => order.Total <= criteria.MaxTotal);
        }

        if (criteria.CreatedAfter is not null)
        {
            query = query.Where(order => order.DateCreated >= criteria.CreatedAfter);
        }

        if (criteria.CreatedBefore is not null)
        {
            query = query.Where(order => order.DateCreated <= criteria.CreatedBefore);
        }

        if (criteria.Status is not null)
        {
            query = query.Where(order => order.Status == OrderMapper.ToDbEntityStatus(criteria.Status));
        }

        if (criteria.ProductId is not null)
        {
            query = query.Where(order => order.OrderItems.Any(item => item.ProductId == criteria.ProductId));
        }

        if (criteria.ProductHistoryId is not null)
        {
            query = query.Where(order => order.OrderItems.Any(item => item.ProductHistoryId == criteria.ProductHistoryId));
        }

        
        if (criteria.OrderSerialNumber is not null)
        {
            query = query.Where(order => order.SerialNumber == criteria.OrderSerialNumber.Value);
        }

        if (criteria.OrderItemSerialNumber is not null)
        {
            query = query.Where(order => order.OrderItems.Any(item => item.SerialNumber == criteria.OrderItemSerialNumber));
        }

        var queryService = _orderDbEntityQueryServiceFactory.Create(query);

        if (criteria.OrderBy is not null)
        {
            queryService.ApplyOrderBy(criteria.OrderBy);
        }

        var dbOrders = await queryService.ReturnResult();
        return dbOrders.Select(OrderMapper.ToDomain).ToList();
    }

    public async Task UpdateAsync(Order order) 
    {
        await LazyUpdateAsync(order);
        await _dbContext.SaveChangesAsync();
    }

    public async Task LazyUpdateAsync(Order order)
    {
        var updatedEntity = OrderMapper.ToDbModel(order);
        var currentEntity = await _dbContext.Order.FindAsync(updatedEntity.Id);
        if (currentEntity is null) throw new Exception($"No Product of Id \"{updatedEntity.Id}\" was found in the cache or the database.");
        
        _dbContext.Entry(currentEntity).CurrentValues.SetValues(updatedEntity);
        await PersistDomainEvents(order);    
    }
}