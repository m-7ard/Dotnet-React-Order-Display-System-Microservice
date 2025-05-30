using Domain.ValueObjects;
using OneOf;

namespace Infrastructure.Values;

public class SecretKey : ValueObject
{
    public static SecretKey AUTH_SERVER_URL => new SecretKey("AUTH_SERVER_URL");
    public static SecretKey API_URL => new SecretKey("API_URL");
    public static SecretKey FILE_SERVER_URL => new SecretKey("FILE_SERVER_URL");
    public static SecretKey KAFKA_ADDRESS => new SecretKey("KAFKA_ADDRESS");
    public static SecretKey RABBIT_ADDRESS => new SecretKey("RABBIT_ADDRESS");
    public static readonly List<SecretKey> ValidValues = [AUTH_SERVER_URL, API_URL, FILE_SERVER_URL, KAFKA_ADDRESS, RABBIT_ADDRESS];

    public string Value { get; }

    private SecretKey(string value)
    {
        Value = value;
    }

    public static OneOf<SecretKey, string> CanCreate(string value)
    {
        var status = ValidValues.Find(status => status.Value == value);

        if (status is null)
        {
            return $"{value} is not a valid SecretValue";
        }

        return status;
    }

    public static SecretKey ExecuteCreate(string value)
    {
        var canCreateResult = CanCreate(value);

        if (canCreateResult.TryPickT1(out var error, out var status))
        {
            throw new Exception(error);
        }

        return status;
    }

    public static bool IsValid(string status)
    {
        return ValidValues.Exists(d => d.Value == status);
    }

    public override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString()
    {
        return Value.ToString();
    }
}