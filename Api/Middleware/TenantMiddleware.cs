using Api.Services;
using Infrastructure.Interfaces;

namespace Api.Middleware;

public class TenantMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IDatabaseProviderSingleton _databaseProvider;

    public TenantMiddleware(RequestDelegate next, IDatabaseProviderSingleton databaseProvider)
    {
        _next = next;
        _databaseProvider = databaseProvider;
    }

    public async Task InvokeAsync(HttpContext context, TenantDatabaseService dbService, ILogger<TenantMiddleware> logger)
    {
        if (_databaseProvider.IsTesting)
        {
            await _next(context);
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
            await dbService.EnsureDatabaseCreatedAsync(clientId);
            
            // Continue processing the request
            await _next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing request for client {ClientId}", clientId);
            throw;
        }
    }
}
