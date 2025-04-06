using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Products.List;
using Application.Common;
using Domain.Models;

namespace Tests.IntegrationTests.Products;

[Collection("Sequential")]
public class ListProductsIntegrationTest : ProductsIntegrationTest
{
    private Product _price1_NameDescProduct1 = null!;
    private Product _price2_NameDescProduct2 = null!;
    private Product _price3_NameDescProduct3 = null!;
    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var mixins = CreateMixins();

        // Delay to prevent date bugs
        _price1_NameDescProduct1 = await mixins.CreateProductAndProductHistory(number: 1, images: []);
        await Task.Delay(50);
        _price2_NameDescProduct2 = await mixins.CreateProductAndProductHistory(number: 2, images: []);
        await Task.Delay(50);
        _price3_NameDescProduct3 = await mixins.CreateProductAndProductHistory(number: 3, images: []);
    }

    [Fact]
    public async Task ListAllProduct_NoParameters_Success()
    {
        var request = new ListProductsRequestDTO
        (
            id: null,
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null,
            orderBy: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductsResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Products);
        Assert.StrictEqual(3, content.Products.Count);
    }

    [Fact]
    public async Task ListAllProduct_Price2OrMore_Success()
    {
        var request = new ListProductsRequestDTO
        (
            id: null,
            name: null,
            minPrice: 2,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null,
            orderBy: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductsResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Products);
        Assert.StrictEqual(2, content.Products.Count);
    }

    [Fact]
    public async Task ListAllProduct_NameContains1_Success()
    {
        var request = new ListProductsRequestDTO
        (
            id: null,
            name: "1",
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null,
            orderBy: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductsResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Products);
        Assert.StrictEqual(1, content.Products.Count);
    }

    [Fact]
    public async Task ListAllProduct_CreatedBeforeProduct2_Success()
    {
        var request = new ListProductsRequestDTO
        (
            id: null,
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: _price2_NameDescProduct2.DateCreated,
            createdAfter: null,
            orderBy: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductsResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Products);
        Assert.StrictEqual(2, content.Products.Count);
    }

    [Fact]
    public async Task ListAllProduct_OrderByNewest_Success()
    {
        var request = new ListProductsRequestDTO
        (
            id: null,
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null,
            orderBy: "newest"
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductsResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Products);
        Assert.StrictEqual(3, content.Products.Count);

        Assert.Equal(_price3_NameDescProduct3.Id.ToString(), content.Products[0].Id);
        Assert.Equal(_price2_NameDescProduct2.Id.ToString(), content.Products[1].Id);
        Assert.Equal(_price1_NameDescProduct1.Id.ToString(), content.Products[2].Id);
    }

    [Fact]
    public async Task ListAllProduct_OrderByOldest_Success()
    {
        var request = new ListProductsRequestDTO(
            id: null,
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null,
            orderBy: "oldest"
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductsResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Products);
        Assert.StrictEqual(3, content.Products.Count);

        Assert.Equal(_price1_NameDescProduct1.Id.ToString(), content.Products[0].Id);
        Assert.Equal(_price2_NameDescProduct2.Id.ToString(), content.Products[1].Id);
        Assert.Equal(_price3_NameDescProduct3.Id.ToString(), content.Products[2].Id);
    }

    [Fact]
    public async Task ListAllProduct_ById_Success()
    {
        var request = new ListProductsRequestDTO
        (
            id: _price1_NameDescProduct1.Id.Value,
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null,
            orderBy: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductsResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Products);
        Assert.StrictEqual(1, content.Products.Count);
    }
}