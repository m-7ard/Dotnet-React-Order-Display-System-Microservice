using Application.Errors.Objects;
using Application.Handlers.Orders.Read;
using Application.Interfaces.Services;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Moq;
using OneOf;
using Tests.UnitTests.Utils;

namespace Tests.UnitTests.Application.Api.Orders;

public class ReadOrderHandlerUnitTest
{
    private readonly Order _mockOrder;
    private readonly ReadOrderHandler _handler;
    private readonly Mock<IOrderDomainService> _mockOrderDomainService;

    public ReadOrderHandlerUnitTest()
    {
        _mockOrderDomainService = new Mock<IOrderDomainService>();

        _handler = new ReadOrderHandler(
            orderDomainService: _mockOrderDomainService.Object
        );

        var product = Mixins.CreateProduct(1, []);
        _mockOrder = Mixins.CreateNewOrderWithItem(
            seed: 1,
            product: product,
            productHistory: ProductHistoryFactory.BuildNewProductHistoryFromProduct(product)
        );
    }

    [Fact]
    public async Task ReadOrder_ValidData_Success()
    {
        // ARRANGE
        var command = new ReadOrderQuery(
            id: _mockOrder.Id.Value
        );

        _mockOrderDomainService.Setup(service => service.GetOrderById(_mockOrder.Id.Value)).ReturnsAsync(_mockOrder);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
        Assert.Equal(result.AsT0.Order, _mockOrder);
    }

    [Fact]
    public async Task ReadOrder_OrderDoesNotExist_Failure()
    {
        // ARRANGE
        var command = new ReadOrderQuery(
            id: _mockOrder.Id.Value
        );

        _mockOrderDomainService.Setup(service => service.GetOrderById(_mockOrder.Id.Value)).ReturnsAsync("");

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<OrderDoesNotExistError>(result.AsT1.First());
    }
}