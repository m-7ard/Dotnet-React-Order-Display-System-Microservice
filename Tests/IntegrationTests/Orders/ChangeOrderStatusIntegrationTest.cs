using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Orders.MarkFinished;
using Application.Interfaces.Persistence;
using Domain.DomainExtension;
using Domain.Models;
using Domain.ValueObjects.Order;
using Microsoft.Extensions.DependencyInjection;
using Tests.IntegrationTests.OrderItems;

namespace Tests.IntegrationTests.Orders;

[Collection("Sequential")]
public class ChangeOrderStatusIntegrationTest : OrderItemsIntegrationTest
{
    private Product _product001 = null!;
    private Product _product002 = null!;
    private Order _order001 = null!;
    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var mixins = CreateMixins();
        _product001 = await mixins.CreateProductAndProductHistory(number: 1, images: []);
        _product002 = await mixins.CreateProductAndProductHistory(number: 2, images: []);
        _order001 = await mixins.CreateNewOrder(
            products: new List<Product>() { _product001, _product002 },
            seed: 1
        );
    }

    [Fact]
    public async Task MarkOrderFinished_ValidData_Success()
    {
        foreach (var orderItem in _order001.OrderItems)
        {
            OrderDomainExtension.ExecuteMarkOrderItemFinished(_order001, orderItem.Id.Value, DateTime.UtcNow);
        }
        using var scope = _factory.Services.CreateScope();
        var repo = scope.ServiceProvider.GetRequiredService<IOrderRepository>();
        await repo.UpdateAsync(_order001);

        var request = new MarkOrderFinishedRequestDTO();
        var response = await _client.PutAsync($"{_route}/{_order001.Id}/mark_finished", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<MarkOrderFinishedResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.OrderId);

        using var newScope = _factory.Services.CreateScope();
        var newRepo = newScope.ServiceProvider.GetRequiredService<IOrderRepository>();

        var order = await newRepo.GetByIdAsync(OrderId.ExecuteCreate(Guid.Parse(content.OrderId)));
        Assert.NotNull(order);

        Assert.Equal(OrderStatus.Finished, order.OrderSchedule.Status);
    }

    [Fact]
    public async Task MarkOrderFinished_NonExistingOrder_Failure()
    {
        var request = new MarkOrderFinishedRequestDTO();
        var response = await _client.PutAsync($"{_route}/{Guid.NewGuid()}/mark_finished", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task MarkOrderFinished_ChangeNotAllowed_Failure()
    {
        using var scope = _factory.Services.CreateScope();
        var repo = scope.ServiceProvider.GetRequiredService<IOrderRepository>();
        _order001.OrderItems.ForEach(orderItem => OrderDomainExtension.ExecuteMarkOrderItemFinished(_order001, orderItem.Id.Value, DateTime.UtcNow));
        OrderDomainExtension.ExecuteMarkFinished(_order001, DateTime.UtcNow);
        await repo.UpdateAsync(_order001);

        var request = new MarkOrderFinishedRequestDTO();
        var response = await _client.PutAsync($"{_route}/{_order001.Id}/mark_finished", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
