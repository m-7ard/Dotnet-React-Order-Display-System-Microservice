using Application.Contracts.Criteria;
using Domain.Models;
using Domain.ValueObjects.Order;

namespace Application.Interfaces.Persistence;

public interface IOrderRepository
{
    Task CreateAsync(Order order);
    Task LazyCreateAsync(Order order);
    Task<Order?> GetByIdAsync(OrderId id);
    Task<List<Order>> FilterAllAsync(FilterOrdersCriteria criteria);
    Task UpdateAsync(Order order);
    Task LazyUpdateAsync(Order order);
}