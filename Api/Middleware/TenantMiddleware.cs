using Api.Producers.Services;
using Api.Services;
using Infrastructure.Interfaces;

namespace Api.Middleware;

public class TenantMiddleware : IMiddleware
{
    private readonly IDatabaseProviderSingleton _databaseProvider;
    private readonly TenantUserService _tenantUserService;
    private readonly TenantDatabaseService _dbService;
    private readonly ILogger<TenantMiddleware> _logger;

    public TenantMiddleware(IDatabaseProviderSingleton databaseProvider, TenantUserService tenantUserService, TenantDatabaseService dbService, ILogger<TenantMiddleware> logger)
    {
        _databaseProvider = databaseProvider;
        _tenantUserService = tenantUserService;
        _dbService = dbService;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (_databaseProvider.IsTesting)
        {
            // Database is currently created in the IntegrationWebApplicationFactory.cs
            _tenantUserService.UserId = "TEST_USER_ID; The exact value doesn't matter for integration tests.";
            await next(context);
            return;
        }

        if (!context.Request.Headers.TryGetValue("X-Client-Id", out var clientIdValues))
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsync("X-Client-Id header is required");
            return;
        }
        
        var clientId = clientIdValues.FirstOrDefault();
        if (string.IsNullOrEmpty(clientId))
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsync("X-Client-Id header cannot be empty");
            return;
        }
        
        context.Items["ClientId"] = clientId;
        
        try
        {
            // Ensure database exists for this tenant
            await _dbService.EnsureDatabaseCreatedAsync(clientId);
            _tenantUserService.UserId = clientId;

            // Continue processing the request
            await next(context);

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing request for client {ClientId}", clientId);
            throw;
        }
    }
}
