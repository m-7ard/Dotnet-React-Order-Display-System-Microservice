using Infrastructure.DbEntities;
using Infrastructure.Interfaces;

namespace Infrastructure.Querying;

public class OrderDbEntityQueryServiceFactory : IOrderDbEntityQueryServiceFactory
{
    private readonly IDatabaseProviderSingleton _databaseProvider;

    public OrderDbEntityQueryServiceFactory(IDatabaseProviderSingleton databaseProvider)
    {
        _databaseProvider = databaseProvider;
    }

    public OrderDbEntityQueryService Create(IQueryable<OrderDbEntity> query)
    {
        return new OrderDbEntityQueryService(databaseProvider: _databaseProvider, query: query);
    }
}