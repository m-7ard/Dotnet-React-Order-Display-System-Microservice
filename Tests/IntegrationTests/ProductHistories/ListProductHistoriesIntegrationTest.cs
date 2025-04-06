using System.Net;
using System.Net.Http.Json;
using Api.DTOs.ProductHistories.List;
using Application.Common;
using Domain.Models;

namespace Tests.IntegrationTests.ProductHistories;

[Collection("Sequential")]
public class ListProductHistoriesIntegrationTest : ProductHistoriesIntegrationTest
{
    private Product _price1_NameDescProduct1 = null!;
    private Product _price2_NameDescProduct2 = null!;
    private Product _price3_NameDescProduct3 = null!;

    public ListProductHistoriesIntegrationTest()
    {
    }

    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var db = _factory.CreateDbContext();
        var mixins = CreateMixins();
        _price1_NameDescProduct1 = await mixins.CreateProductAndProductHistory(number: 1, images: []);
        _price2_NameDescProduct2 = await mixins.CreateProductAndProductHistory(number: 2, images: []);
        _price3_NameDescProduct3 = await mixins.CreateProductAndProductHistory(number: 3, images: []);
    }

    [Fact]
    public async Task ListAllProductHistories_NoParameters_Success()
    {
        var request = new ListProductHistoriesRequestDTO
        (
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            validFrom: null,
            validTo: null,
            productId: null,
            orderBy: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductHistoriesResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.ProductHistories);
        Assert.StrictEqual(3, content.ProductHistories.Count);
    }

    [Fact]
    public async Task ListAllProductHistories_Price2OrMore_Success()
    {
        var request = new ListProductHistoriesRequestDTO
        (
            name: null,
            minPrice: 2,
            maxPrice: null,
            description: null,
            validFrom: null,
            validTo: null,
            productId: null,
            orderBy: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductHistoriesResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.ProductHistories);
        Assert.StrictEqual(2, content.ProductHistories.Count);
    }

    [Fact]
    public async Task ListAllProductHistories_NameContains1_Success()
    {
        var request = new ListProductHistoriesRequestDTO
        (
            name: "1",
            minPrice: null,
            maxPrice: null,
            description: null,
            validFrom: null,
            validTo: null,
            productId: null,
            orderBy: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductHistoriesResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.ProductHistories);
        Assert.StrictEqual(1, content.ProductHistories.Count);
    }

    [Fact]
    public async Task ListAllProductHistories_Product2_Success()
    {
        var request = new ListProductHistoriesRequestDTO
        (
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            validFrom: null,
            validTo: null,
            productId: _price2_NameDescProduct2.Id.Value,
            orderBy: null
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductHistoriesResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.ProductHistories);
        Assert.StrictEqual(1, content.ProductHistories.Count);
    }

    [Fact]
    public async Task ListAllProductHistories_OrderByNewest_Success()
    {
        var request = new ListProductHistoriesRequestDTO
        (
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            validFrom: null,
            validTo: null,
            productId: null,
            orderBy: "newest"
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductHistoriesResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.ProductHistories);

        Assert.Equal(_price1_NameDescProduct1.Id.ToString(), content.ProductHistories[2].ProductId);
        Assert.Equal(_price2_NameDescProduct2.Id.ToString(), content.ProductHistories[1].ProductId);
        Assert.Equal(_price3_NameDescProduct3.Id.ToString(), content.ProductHistories[0].ProductId);
    }

    [Fact]
    public async Task ListAllProductHistories_OrderByOldest_Success()
    {
        var request = new ListProductHistoriesRequestDTO
        (
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            validFrom: null,
            validTo: null,
            productId: null,
            orderBy: "oldest"
        );
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListProductHistoriesResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.ProductHistories);

        Assert.Equal(_price1_NameDescProduct1.Id.ToString(), content.ProductHistories[0].ProductId);
        Assert.Equal(_price2_NameDescProduct2.Id.ToString(), content.ProductHistories[1].ProductId);
        Assert.Equal(_price3_NameDescProduct3.Id.ToString(), content.ProductHistories[2].ProductId);
    }
}