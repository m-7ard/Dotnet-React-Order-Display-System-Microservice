using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class TenantDatabaseService
{
    private readonly string _baseConnectionString;
    
    public TenantDatabaseService(IConfiguration configuration)
    {
        _baseConnectionString = "Data Source=client_{clientId}.db";
    }
    
    public string GetConnectionStringForTenant(string clientId)
    {
        if (string.IsNullOrEmpty(clientId))
        {
            throw new ArgumentException("Client ID cannot be null or empty", nameof(clientId));        
        }
            
        return _baseConnectionString.Replace("{clientId}", clientId);
    }
    
    public async Task EnsureDatabaseCreatedAsync(string clientId)
    {
        var connectionString = GetConnectionStringForTenant(clientId);
        
        // Create database context options
        var options = new DbContextOptionsBuilder<SimpleProductOrderServiceDbContext>()
            .UseSqlite(connectionString)
            .Options;
            
        // Create database if it doesn't exist
        using var context = new SimpleProductOrderServiceDbContext(options);
        await context.Database.EnsureCreatedAsync();
    }
}