using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class TenantDatabaseService
{
    private readonly string _baseConnectionString;
    
    public TenantDatabaseService()
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
        
        var filePath = $"client_{clientId}.db";

        if (!File.Exists(filePath))
        {
            var options = new DbContextOptionsBuilder<SimpleProductOrderServiceDbContext>()
                .UseSqlite(connectionString)
                .Options;

            using var context = new SimpleProductOrderServiceDbContext(options);
            await context.Database.EnsureCreatedAsync();
            Console.WriteLine($"Database created for client {clientId}");
        }
        else
        {
            Console.WriteLine($"Database already exists for client {clientId}");
        }
    }
}