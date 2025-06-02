using Infrastructure.Interfaces;
using Infrastructure.Values;

namespace Api.Services;

public class SecretsInitializer : IHostedService
{
    private readonly ISecretsDataAccess _secretsDataAccess;
    private readonly SecretsStore _store;
    private readonly ILogger<SecretsInitializer> _logger;
    private readonly InitializationCoordinator _coordinator;

    public SecretsInitializer(ISecretsDataAccess secretsDataAccess, SecretsStore store, ILogger<SecretsInitializer> logger, InitializationCoordinator coordinator)
    {
        _secretsDataAccess = secretsDataAccess;
        _store = store;
        _logger = logger;
        _coordinator = coordinator;
    }

    private async Task GetSecret(SecretKey key)
    {
        try
        {
            // Relevant during integration tests to only get the secrets once per test run
            _store.GetSecret(key);
            return;
        }
        catch
        {
            var value = await _secretsDataAccess.GetKeyValue(key);
            _store.SetSecret(key, value);
        }
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            foreach (var key in SecretKey.ValidValues)
            {
                await GetSecret(key);
            }

            _logger.LogInformation("Secrets initialized at startup.");
            _coordinator.Signal("SECRET_INIT");
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "Failed to initialize secrets.");
            throw;
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}