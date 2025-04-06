using Infrastructure.DbEntities;
using Infrastructure.Querying;

namespace Infrastructure.Interfaces;

public interface IProductDbEntityQueryServiceFactory
{
    ProductDbEntityQueryService Create(IQueryable<ProductDbEntity> query);
}