using Microsoft.Extensions.DependencyInjection;

namespace Tests.IntegrationTests;

public class BaseIntegrationTest : IAsyncLifetime
{
    protected readonly IntegrationWebApplicationFactory<Program> _factory;
    protected readonly HttpClient _client;

    public BaseIntegrationTest()
    {
        _factory = new IntegrationWebApplicationFactory<Program>();
        _client = _factory.CreateClient();
    }

    public virtual async Task InitializeAsync()
    {
        await Task.CompletedTask;
    }

    public async Task DisposeAsync()
    {
        if (_client != null)
        {
            _client.Dispose();
        }
        if (_factory != null)
        {
            await _factory.DisposeAsync();
        }
    }

    public Mixins CreateMixins()
    {
        var db = _factory.CreateDbContext();
        var dbProvider = _factory.GetDatabaseProviderSingleton();
        var mixins = new Mixins(db, dbProvider);
        return mixins;
    }

    public T GetService<T>() where T : notnull
    {
        using var scope = _factory.Services.CreateScope();
        var service = scope.ServiceProvider.GetRequiredService<T>();
        return service;
    }
}