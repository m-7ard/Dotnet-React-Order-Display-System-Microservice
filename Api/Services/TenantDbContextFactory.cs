using Infrastructure;
using Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class TenantDbContextFactory
{
    private readonly TenantDatabaseService _dbService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IDatabaseProviderSingleton _databaseProviderSingleton;
    private readonly SimpleProductOrderServiceDbContext? _testDbContext;

    public TenantDbContextFactory(
        TenantDatabaseService dbService,
        IHttpContextAccessor httpContextAccessor,
        IDatabaseProviderSingleton databaseProviderSingleton,
        SimpleProductOrderServiceDbContext? testDbContext)
    {
        _dbService = dbService;
        _httpContextAccessor = httpContextAccessor;
        _databaseProviderSingleton = databaseProviderSingleton;
        _testDbContext = testDbContext;
    }

    public SimpleProductOrderServiceDbContext CreateDbContext()
    {
        if (_databaseProviderSingleton.IsTesting)
        {
            if (_testDbContext != null)
            {
                return _testDbContext;
            }

            throw new Exception("No database context was configured for the testing environment.");
        }

        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
        {
            throw new InvalidOperationException("HttpContext is not available");        
        }
            
        if (!httpContext.Items.TryGetValue("ClientId", out var clientIdObj) || clientIdObj is null)
        {
            throw new InvalidOperationException("Client ID not found in HttpContext");        
        }
            
        var clientId = clientIdObj.ToString();
        if (clientId is null)
        {
            throw new Exception("Client ID cannot be null.");                
        }
    
        var connectionString = _dbService.GetConnectionStringForTenant(clientId);
        
        var options = new DbContextOptionsBuilder<SimpleProductOrderServiceDbContext>()
            .UseSqlite(connectionString)
            .Options;
            
        return new SimpleProductOrderServiceDbContext(options);
    }
}