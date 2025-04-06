using Infrastructure.DbEntities;
using Infrastructure.Interfaces;

namespace Infrastructure.Querying;

public class ProductDbEntityQueryServiceFactory : IProductDbEntityQueryServiceFactory
{
    private readonly IDatabaseProviderSingleton _databaseProvider;

    public ProductDbEntityQueryServiceFactory(IDatabaseProviderSingleton databaseProvider)
    {
        _databaseProvider = databaseProvider;
    }

    public ProductDbEntityQueryService Create(IQueryable<ProductDbEntity> query)
    {
        return new ProductDbEntityQueryService(databaseProvider: _databaseProvider, query: query);
    }
}