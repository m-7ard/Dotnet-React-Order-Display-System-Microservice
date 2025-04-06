using Application.Contracts.DomainService.OrderDomainService;
using Application.Errors;
using Application.Errors.Objects;
using Application.Handlers.Orders.MarkFinished;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.Contracts.Orders;
using Domain.DomainExtension;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Moq;
using OneOf;

namespace Tests.UnitTests.Application.Api.Orders;

public class MarkOrderFinishedHandlerUnitTest
{
    private readonly Order _mockOrder;
    private readonly OrderItem _mockOrderItem;
    private readonly MarkOrderFinishedHandler _handler;
    private readonly Mock<IOrderDomainService> _mockOrderDomainService;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;

    public MarkOrderFinishedHandlerUnitTest()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockOrderDomainService = new Mock<IOrderDomainService>();


        _handler = new MarkOrderFinishedHandler(
            orderDomainService: _mockOrderDomainService.Object,
            unitOfWork: _mockUnitOfWork.Object
        );
        
        var product = Mixins.CreateProduct(1, []);
        _mockOrder = Mixins.CreateNewOrderWithItem(seed: 1, product: product, productHistory: ProductHistoryFactory.BuildNewProductHistoryFromProduct(product));
        _mockOrderItem = _mockOrder.OrderItems[0];
    }

    [Fact]
    public async Task MarkOrderFinished_ValidData_Success()
    {
        // ARRANGE
        var command = new MarkOrderFinishedCommand(
            orderId: _mockOrder.Id.Value
        );

        _mockOrderDomainService.Setup(service => service.GetOrderById(_mockOrder.Id.Value)).ReturnsAsync(_mockOrder);
        _mockOrderDomainService.Setup(service => service.TryOrchestrateTransitionOrderStatus(It.IsAny<OrchestrateTransitionOrderStatusContract>())).ReturnsAsync(true);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task MarkOrderFinished_OrderDoesNotExist_Failure()
    {
        // ARRANGE
        var command = new MarkOrderFinishedCommand(
            orderId: Guid.Empty
        );

        _mockOrderDomainService.Setup(service => service.GetOrderById(command.OrderId)).ReturnsAsync("");

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<OrderDoesNotExistError>(result.AsT1.First());
    }

    [Fact]
    public async Task MarkOrderFinished_CannotTransition_Failure()
    {
        // ARRANGE
        var command = new MarkOrderFinishedCommand(
            orderId: _mockOrder.Id.Value
        );

        _mockOrderDomainService.Setup(service => service.GetOrderById(_mockOrder.Id.Value)).ReturnsAsync(_mockOrder);
        _mockOrderDomainService.Setup(service => service.TryOrchestrateTransitionOrderStatus(It.IsAny<OrchestrateTransitionOrderStatusContract>())).ReturnsAsync("");

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotTransitionOrderStatusError>(result.AsT1.First());
    }
}