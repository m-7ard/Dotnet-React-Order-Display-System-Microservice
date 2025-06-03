using Infrastructure.Values;

namespace Api.Services;

public static class BuilderUtils
{
    public class AppSettings
    {
        public DatabaseProviderSingletonValue DatabaseProviderValue { get; }
        public string ConnectionString { get; }
        public string SecretsServerUrl { get; }

        public AppSettings(DatabaseProviderSingletonValue databaseProvidervalue, string connectionString, string secretsServerUrl)
        {
            DatabaseProviderValue = databaseProvidervalue;
            ConnectionString = connectionString;
            SecretsServerUrl = secretsServerUrl;
        }
    }

    public static AppSettings ReadAppSettings(ConfigurationManager config)
    {
        var dbProvider = config["Database:Provider"] ?? throw new Exception("Database provider name cannot be null.");
        var connectionString = config[$"{dbProvider}_Database"] ?? throw new Exception("Connection string cannot be null.");
        var secretsServerUrl = config["LocalSecretServerUrl"] ?? throw new Exception("Secret server url cannot be null.");
        var dbProviderValue = DatabaseProviderSingletonValue.ExecuteCreate(dbProvider);

        return new AppSettings(databaseProvidervalue: dbProviderValue, connectionString: connectionString, secretsServerUrl: secretsServerUrl);
    }

    public static AppSettings ReadTestAppSettings(IConfiguration config)
    {
        var dbProvider = config["Testing:Database:Provider"] ?? throw new Exception("Database provider name cannot be null.");
        var connectionString = config[$"Testing:{dbProvider}_Database"] ?? throw new Exception("Connection string cannot be null.");
        var secretsServerUrl = config["LocalSecretServerUrl"] ?? throw new Exception("Secret server url cannot be null.");
        var dbProviderValue = DatabaseProviderSingletonValue.ExecuteCreate(dbProvider);

        return new AppSettings(databaseProvidervalue: dbProviderValue, connectionString: connectionString, secretsServerUrl: secretsServerUrl);    }
}