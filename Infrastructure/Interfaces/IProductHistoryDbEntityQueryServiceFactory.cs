using Infrastructure.DbEntities;
using Infrastructure.Querying;

namespace Infrastructure.Interfaces;

public interface IProductHistoryDbEntityQueryServiceFactory
{
    ProductHistoryDbEntityQueryService Create(IQueryable<ProductHistoryDbEntity> query);
}