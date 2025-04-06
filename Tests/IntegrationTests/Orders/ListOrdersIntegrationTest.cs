using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Orders.List;
using Application.Common;
using Domain.Models;
using Domain.ValueObjects.Order;
using Microsoft.EntityFrameworkCore;

namespace Tests.IntegrationTests.Orders;

[Collection("Sequential")]
public class ListOrdersIntegrationTest : OrdersIntegrationTest
{
    private ListOrdersRequestDTO _baseRequest = null!;
    private Product _product001 = null!;
    private Product _product002 = null!;
    private Product _product003 = null!;
    private Order _order001 = null!;
    private Order _order002 = null!;
    private Order _order003 = null!;
    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var mixins = CreateMixins();
        _product001 = await mixins.CreateProductAndProductHistory(number: 1, images: []);
        _product002 = await mixins.CreateProductAndProductHistory(number: 2, images: []);
        _product003 = await mixins.CreateProductAndProductHistory(number: 3, images: []);
        _order001 = await mixins.CreateNewOrder(
            products: new List<Product>() { _product001, _product002 },
            seed: 1
        );
        _order002 = await mixins.CreateFinishedOrder(
            products: new List<Product>() { _product001, _product002 },
            seed: 10
        );
        _order003 = await mixins.CreateNewOrder(
            products: new List<Product>() { _product003 },
            seed: 100
        );
        _baseRequest = new ListOrdersRequestDTO(
            minTotal: null,
            maxTotal: null,
            status: null,
            createdBefore: null,
            createdAfter: null,
            id: null,
            productId: null,
            productHistoryId: null,
            orderBy: null,
            orderItemSerialNumber: null,
            orderSerialNumber: null
        );
    }

    [Fact]
    public async Task ListAllOrders_NoParameters_Success()
    {
        var request = _baseRequest;
        var queryString = ObjToQueryString.Convert(request);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);
        Assert.StrictEqual(3, content.Orders.Count);
    }

    [Fact]
    public async Task ListAllOrders_MaxTotal_Success()
    {
        _baseRequest.MaxTotal = _order001.Total.Value;

        var queryString = ObjToQueryString.Convert(_baseRequest);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);
        Assert.StrictEqual(1, content.Orders.Count);
    }

    [Fact]
    public async Task ListAllOrders_CreatedBefore_Success()
    {
        _baseRequest.CreatedBefore = _order001.OrderSchedule.Dates.DateCreated;

        var queryString = ObjToQueryString.Convert(_baseRequest);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);
        Assert.StrictEqual(1, content.Orders.Count);
    }

    [Fact]
    public async Task ListAllOrders_ValidStatus_Success()
    {
        _baseRequest.Status = OrderStatus.Finished.Name;

        var queryString = ObjToQueryString.Convert(_baseRequest);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);
        Assert.StrictEqual(1, content.Orders.Count);
    }

    [Fact]
    public async Task ListAllOrders_ValidId_Success()
    {
        _baseRequest.Id = _order001.Id.Value;

        var queryString = ObjToQueryString.Convert(_baseRequest);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);
        Assert.StrictEqual(1, content.Orders.Count);
    }

    [Fact]
    public async Task ListAllOrders_ValidProductId_Success()
    {
        _baseRequest.ProductId = _product001.Id.Value;

        var queryString = ObjToQueryString.Convert(_baseRequest);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);
        Assert.StrictEqual(2, content.Orders.Count);
    }

    [Fact]
    public async Task ListAllOrders_ValidProductHistoryId_Success()
    {
        var db = _factory.CreateDbContext();
        var product001History = await db.ProductHistory.SingleAsync(d => d.ProductId == _product001.Id.Value);

        _baseRequest.ProductHistoryId = product001History.Id;

        var queryString = ObjToQueryString.Convert(_baseRequest);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);
        Assert.StrictEqual(2, content.Orders.Count);
    }
    
    [Fact]
    public async Task ListAllOrders_OrderByNewest_Success()
    {
        _baseRequest.OrderBy = "newest";

        var queryString = ObjToQueryString.Convert(_baseRequest);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);

        Assert.Equal(_order003.Id.Value.ToString(), content.Orders[0].Id);
        Assert.Equal(_order002.Id.Value.ToString(), content.Orders[1].Id);
        Assert.Equal(_order001.Id.Value.ToString(), content.Orders[2].Id);
    }

    [Fact]
    public async Task ListAllOrders_OrderByOldest_Success()
    {
        _baseRequest.OrderBy = "oldest";

        var queryString = ObjToQueryString.Convert(_baseRequest);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);

        Assert.Equal(_order003.Id.Value.ToString(), content.Orders[2].Id);
        Assert.Equal(_order002.Id.Value.ToString(), content.Orders[1].Id);
        Assert.Equal(_order001.Id.Value.ToString(), content.Orders[0].Id);
    }

    [Fact]
    public async Task ListAllOrders_ValidOrderSerialNumber_Success()
    {
        _baseRequest.OrderSerialNumber = _order001.SerialNumber;

        var queryString = ObjToQueryString.Convert(_baseRequest);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);
        Assert.StrictEqual(1, content.Orders.Count);
        Assert.Equal(_order001.Id.Value.ToString(), content.Orders[0].Id);
    }

    [Fact]
    public async Task ListAllOrders_ValidOrderItemSerialNumber_Success()
    {
        var orderItem = _order001.OrderItems[0];
        _baseRequest.OrderItemSerialNumber = orderItem.SerialNumber;

        var queryString = ObjToQueryString.Convert(_baseRequest);
        var response = await _client.GetAsync($"{_route}/list?{queryString}");

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<ListOrdersResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Orders);
        Assert.StrictEqual(1, content.Orders.Count);
        Assert.Equal(_order001.Id.Value.ToString(), content.Orders[0].Id);
        Assert.Contains(_order001.OrderItems, item => item.SerialNumber == orderItem.SerialNumber);
    }
}
