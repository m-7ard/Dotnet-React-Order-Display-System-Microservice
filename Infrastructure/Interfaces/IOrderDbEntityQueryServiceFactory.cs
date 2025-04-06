using Infrastructure.DbEntities;
using Infrastructure.Querying;

namespace Infrastructure.Interfaces;

public interface IOrderDbEntityQueryServiceFactory
{
    OrderDbEntityQueryService Create(IQueryable<OrderDbEntity> query);
}