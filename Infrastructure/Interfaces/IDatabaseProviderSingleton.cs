using Infrastructure.Values;

namespace Infrastructure.Interfaces;

public interface IDatabaseProviderSingleton
{
    DatabaseProviderSingletonValue Value { get; }
    bool IsSQLite { get; }
    bool IsMSSQL { get; }
    bool IsTesting { get; }
    string ConnectionString { get; }
} 