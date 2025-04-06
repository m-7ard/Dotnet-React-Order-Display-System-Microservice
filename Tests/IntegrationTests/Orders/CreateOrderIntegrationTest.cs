using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Orders.Create;
using Application.Interfaces.Persistence;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace Tests.IntegrationTests.Orders;

[Collection("Sequential")]
public class CreateOrderIntegrationTest : OrdersIntegrationTest
{
    private Product _PRODUCT_001 = null!;
    private Product _PRODUCT_002 = null!;
    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var mixins = CreateMixins();
        _PRODUCT_001 = await mixins.CreateProductAndProductHistory(number: 1, images: []);
        _PRODUCT_002 = await mixins.CreateProductAndProductHistory(number: 2, images: []);
    }

    [Fact]
    public async Task CreateOrder_ValidData_Success()
    {
        // Setup
        var orderItemData = new Dictionary<string, CreateOrderRequestDTO.OrderItem>();
        orderItemData["product_1"] = new CreateOrderRequestDTO.OrderItem(
            productId: _PRODUCT_001.Id.Value,
            quantity: 1
        );
        orderItemData["product_2"] = new CreateOrderRequestDTO.OrderItem(
            productId: _PRODUCT_002.Id.Value,
            quantity: 1
        );

        var request = new CreateOrderRequestDTO(
            orderItemData: orderItemData
        );

        // Act
        var response = await _client.PostAsync($"{_route}/create", JsonContent.Create(request));
        
        // Assert 
        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<CreateOrderResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.OrderId);

        var isValidGuid = Guid.TryParse(content.OrderId, out var parsedId);
        Assert.True(isValidGuid);

        using var scope = _factory.Services.CreateScope();
        var repo = scope.ServiceProvider.GetRequiredService<IOrderRepository>();

        var order = await repo.GetByIdAsync(OrderId.ExecuteCreate(parsedId));
        Assert.NotNull(order);
        Assert.NotEmpty(order.OrderItems);

        Assert.Equal(OrderStatus.Pending, order.OrderSchedule.Status);
        Assert.StrictEqual(2, order.OrderItems.Count);

        Assert.True(order.OrderItems.All(item => item.Schedule.Status == OrderItemStatus.Pending));
    }

    [Fact]
    public async Task CreateOrder_EmptyOrderItemData_Falure()
    {
        // Setup
        var orderItemData = new Dictionary<string, CreateOrderRequestDTO.OrderItem>();

        var request = new CreateOrderRequestDTO(
            orderItemData: orderItemData
        );
        // Act
        var response = await _client.PostAsync($"{_route}/create", JsonContent.Create(request));

        // Assert 
        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateOrder_NonExistingProduct_Falure()
    {
        // Setup
        var orderItemData = new Dictionary<string, CreateOrderRequestDTO.OrderItem>();
        orderItemData["product_1"] = new CreateOrderRequestDTO.OrderItem(
            productId: Guid.Empty,
            quantity: 1
        );

        var request = new CreateOrderRequestDTO(
            orderItemData: orderItemData
        );
        // Act
        var response = await _client.PostAsync($"{_route}/create", JsonContent.Create(request));

        // Assert 
        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateOrder_InvalidOrderItemData_Falure()
    {
        // Setup
        var orderItemData = new Dictionary<string, CreateOrderRequestDTO.OrderItem>();
        orderItemData["product_1"] = new CreateOrderRequestDTO.OrderItem(
            productId: Guid.NewGuid(),
            quantity: 0
        );

        var request = new CreateOrderRequestDTO(
            orderItemData: orderItemData
        );

        // Act
        var response = await _client.PostAsync($"{_route}/create", JsonContent.Create(request));

        // Assert 
        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }


    [Fact]
    public async Task CreateOrder_QuantityTooLarge_Falure()
    {
        // Setup
        var orderItemData = new Dictionary<string, CreateOrderRequestDTO.OrderItem>();
        orderItemData["product_1"] = new CreateOrderRequestDTO.OrderItem(
            productId:  _PRODUCT_001.Id.Value,
            quantity:  _PRODUCT_001.Amount.Value + 1
        );

        var request = new CreateOrderRequestDTO(
            orderItemData: orderItemData
        );

        // Act
        var response = await _client.PostAsync($"{_route}/create", JsonContent.Create(request));

        // Assert 
        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}