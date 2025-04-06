using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Products.Read;
using Domain.Models;

namespace Tests.IntegrationTests.Products;

[Collection("Sequential")]
public class ReadProductIntegrationTest : ProductsIntegrationTest
{
    private Product _product001 = null!;
    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var mixins = CreateMixins();
        _product001 = await mixins.CreateProductAndProductHistory(number: 1, images: []);
    }

    [Fact]
    public async Task ReadProduct_ValidData_Success()
    {
        var response = await _client.GetAsync($"{_route}/{_product001.Id}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ReadProductResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Product);
    }

    [Fact]
    public async Task ReadProduct_NonExistingId_Failure()
    {
        var request = new ReadProductRequestDTO();
        var response = await _client.GetAsync($"{_route}/10000");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task ReadProduct_InvalidId_Failure()
    {
        var request = new ReadProductRequestDTO();
        var response = await _client.GetAsync($"{_route}/invalid");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}