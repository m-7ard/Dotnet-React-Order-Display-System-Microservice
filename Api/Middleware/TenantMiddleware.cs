using Api.Services;

namespace Api.Middleware;

public class TenantMiddleware
{
    private readonly RequestDelegate _next;
    
    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }
    
    public async Task InvokeAsync(HttpContext context, TenantDatabaseService dbService, ILogger<TenantMiddleware> logger)
    {
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
        
        // Store client ID in HttpContext items for later retrieval
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
