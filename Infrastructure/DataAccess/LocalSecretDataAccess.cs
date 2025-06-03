using System.Net.Http.Json;
using System.Text.Json;
using Infrastructure.DTOs.Secrets;
using Infrastructure.Interfaces;
using Infrastructure.Values;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.DataAccess;

public class LocalSecretDataAccess : ISecretsDataAccess
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;

    public LocalSecretDataAccess(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClient = httpClientFactory.CreateClient("InsecureClient");
        _baseUrl = configuration["LocalSecretServerUrl"] ?? throw new Exception("LocalSecretDataAccess requires a url the local server. Config's LocalSecretServerUrl cannot be null.");
    }

    public async Task<string> GetKeyValue(SecretKey secretKey)
    {
        var response = await _httpClient.GetAsync($"{_baseUrl}/secrets/{secretKey.Value}");

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"No secret of key \"{secretKey}\" exists.");
        }

        var json = await response.Content.ReadAsStringAsync();
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true, // Allows matching without exact case
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase // Maps camelCase JSON to PascalCase C# properties
        };

        var dto = JsonSerializer.Deserialize<ReadSecretResponseDTO>(json, options);
        if (dto is null)
        {
            throw new Exception("GetKeyValue's request succeeded but failed to deserialize the JSON into a DTO."); 
        }

        return dto.Value;
    }
}