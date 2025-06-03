namespace Infrastructure.DTOs.Secrets;

public class ReadSecretResponseDTO
{
    public ReadSecretResponseDTO(string key, string value, DateTime retrievedAt)
    {
        Key = key;
        Value = value;
        RetrievedAt = retrievedAt;
    }

    public string Key { get; }
    public string Value { get; }
    public DateTime RetrievedAt { get; }
}