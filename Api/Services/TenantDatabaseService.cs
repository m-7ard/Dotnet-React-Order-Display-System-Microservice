using Infrastructure;
using Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class TenantDatabaseService
{
    private readonly IDatabaseProviderSingleton _databaseProviderSingleton;

    public TenantDatabaseService(IDatabaseProviderSingleton databaseProviderSingleton)
    {
        _databaseProviderSingleton = databaseProviderSingleton;
    }

    public string GetConnectionStringForTenant(string clientId)
    {
        if (string.IsNullOrEmpty(clientId))
        {
            throw new ArgumentException("Client ID cannot be null or empty", nameof(clientId));        
        }
            
        return _databaseProviderSingleton.ConnectionString.Replace("{clientId}", clientId);
    }
    
    public async Task EnsureDatabaseCreatedAsync(string clientId)
    {
        var connectionString = GetConnectionStringForTenant(clientId);
        DbContextOptions<SimpleProductOrderServiceDbContext>? options = null;

        if (_databaseProviderSingleton.IsSQLite)
        {
            options = new DbContextOptionsBuilder<SimpleProductOrderServiceDbContext>()
                .UseSqlite(connectionString)
                .Options;
        }
        else if (_databaseProviderSingleton.IsMSSQL)
        {
            options = new DbContextOptionsBuilder<SimpleProductOrderServiceDbContext>()
                .UseSqlServer(connectionString)
                .Options;
        }
        else
        {
            throw new Exception($"TenantDatabaseService has not been configured for DB type {_databaseProviderSingleton.Value}");
        }
        
        using var context = new SimpleProductOrderServiceDbContext(options);
        var created = await context.Database.EnsureCreatedAsync();
        Console.WriteLine($"Database created for client {clientId}");
    }
}