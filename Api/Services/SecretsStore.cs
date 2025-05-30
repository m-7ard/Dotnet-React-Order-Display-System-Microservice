using Infrastructure.Values;

namespace Api.Services;

public class SecretsStore
{
    private readonly Dictionary<string, string> _secrets = new();

    public void SetSecret(SecretKey key, string value)
    {
        _secrets[key.Value] = value;
    }

    public string GetSecret(SecretKey key)
    {
        if (_secrets.TryGetValue(key.Value, out var value))
        {
            if (string.IsNullOrEmpty(value))
            {
                throw new Exception($"Secret of key \"{key}\" cannot be empty.");
            }

            return value;
        }

        throw new Exception($"Secret of key \"{key}\" has not been stored in SecretsStore.");
    }
}