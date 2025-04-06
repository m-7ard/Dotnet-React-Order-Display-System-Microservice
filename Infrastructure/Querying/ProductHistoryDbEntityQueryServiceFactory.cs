using Infrastructure.DbEntities;
using Infrastructure.Interfaces;

namespace Infrastructure.Querying;

public class ProductHistoryDbEntityQueryServiceFactory : IProductHistoryDbEntityQueryServiceFactory
{
    private readonly IDatabaseProviderSingleton _databaseProvider;

    public ProductHistoryDbEntityQueryServiceFactory(IDatabaseProviderSingleton databaseProvider)
    {
        _databaseProvider = databaseProvider;
    }

    public ProductHistoryDbEntityQueryService Create(IQueryable<ProductHistoryDbEntity> query)
    {
        return new ProductHistoryDbEntityQueryService(databaseProvider: _databaseProvider, query: query);
    }
}