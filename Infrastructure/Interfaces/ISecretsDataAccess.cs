using Infrastructure.Values;

namespace Infrastructure.Interfaces;

public interface ISecretsDataAccess
{
    Task<string> GetKeyValue(SecretKey secretKey);
}