using System.Linq.Expressions;
using Infrastructure.DbEntities;
using Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Querying;

public class OrderDbEntityQueryService
{
    private readonly List<Func<List<OrderDbEntity>, List<OrderDbEntity>>> _inMemoryCallbacks = [];
    private readonly IDatabaseProviderSingleton _databaseProvider;
    private readonly Dictionary<string, Expression<Func<OrderDbEntity, object>>> _fieldMapping = new()
    {
        { "Total", p => p.Total },
        { "DateCreated", p => p.DateCreated },
    };

    private IQueryable<OrderDbEntity> _query;


    public OrderDbEntityQueryService(IDatabaseProviderSingleton databaseProvider, IQueryable<OrderDbEntity> query)
    {
        _databaseProvider = databaseProvider;
        _query = query;
    }

    private void SortInMemory(string field, bool ascending)
    {
        var orderByExpression = _fieldMapping[field];

        _inMemoryCallbacks.Add((products) => ascending
            ? products.OrderBy(orderByExpression.Compile()).ToList()
            : products.OrderByDescending(orderByExpression.Compile()).ToList());
    }

    private void SortInDatabase(string field, bool ascending)
    {
        var orderByExpression = _fieldMapping[field];
        
        _query = ascending
            ? _query.OrderBy(orderByExpression) 
            : _query.OrderByDescending(orderByExpression);
    }

    public void ApplyOrderBy(Tuple<string, bool> policy)
    {
        var (field, ascending) = policy;
     
        if (_databaseProvider.IsSQLite)
        {
            SortInMemory(field, ascending);
        }
        else if (_databaseProvider.IsMSSQL)
        {
            SortInDatabase(field, ascending);
        }
        else
        {
            throw new Exception($"No handler for FilterAllAsync for database provider \"{_databaseProvider.Value}\".");
        }
    }

    public async Task<List<OrderDbEntity>> ReturnResult()
    {
        var result = await _query.ToListAsync();
        return _inMemoryCallbacks.Aggregate(result, (current, func) => func(current));
    }
}