using Infrastructure.Interfaces;
using Infrastructure.Values;

namespace Api.Services;

public class DatabaseProviderSingleton : IDatabaseProviderSingleton
{
    public DatabaseProviderSingletonValue Value { get; }
    public bool IsSQLite { get; }
    public bool IsMSSQL { get; }
    public bool IsTesting { get; }

    public DatabaseProviderSingleton(DatabaseProviderSingletonValue value, bool isTesting = false)
    {
        Value = value;
        IsSQLite = value == DatabaseProviderSingletonValue.Sqlite;
        IsMSSQL = value == DatabaseProviderSingletonValue.SqlServer;

        if ((IsSQLite || IsMSSQL) is false)
        {
            throw new Exception($"\"{value}\" is not a valid database provider name.");
        }

        IsTesting = isTesting;
    }
}