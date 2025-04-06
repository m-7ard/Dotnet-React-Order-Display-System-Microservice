using Application.Contracts.DomainService.OrderDomainService;
using Application.Errors.Objects;
using Application.Handlers.OrderItems.MarkFinished;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.DomainFactories;
using Domain.Models;
using Moq;

namespace Tests.UnitTests.Application.Api.OrderIItems;

public class MarkOrderItemFinishedHandlerUnitTest
{
    private readonly Mock<IOrderDomainService> _mockOrderDomainService;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Order _mockOrder;
    private readonly OrderItem _mockOrderItem;
    private readonly MarkOrderItemFinishedHandler _handler;

    public MarkOrderItemFinishedHandlerUnitTest()
    {
        _mockOrderDomainService = new Mock<IOrderDomainService>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();

        _handler = new MarkOrderItemFinishedHandler(
            orderDomainService: _mockOrderDomainService.Object,
            unitOfWork: _mockUnitOfWork.Object
        );

        var product = Mixins.CreateProduct(1, []);
        _mockOrder = Mixins.CreateNewOrderWithItem(seed: 1, product: product, productHistory: ProductHistoryFactory.BuildNewProductHistoryFromProduct(product));
        _mockOrderItem = _mockOrder.OrderItems[0];
    }

    [Fact]
    public async Task MarkOrderItemFinished_ValidData_Success()
    {
        // ARRANGE
        var command = new MarkOrderItemFinishedCommand(
            orderId: _mockOrder.Id.Value,
            orderItemId: _mockOrderItem.Id.Value
        );

        _mockOrderDomainService.Setup(service => service.GetOrderById(_mockOrder.Id.Value)).ReturnsAsync(_mockOrder);
        _mockOrderDomainService.Setup(service => service.TryOrchestrateTransitionOrderItemStatus(It.IsAny<OrchestrateTransitionOrderItemStatusContract>())).ReturnsAsync(true);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task MarkOrderItemFinished_OrderDoesNotExist_Failure()
    {
        // ARRANGE
        var command = new MarkOrderItemFinishedCommand(
            orderId: Guid.Empty,
            orderItemId: Guid.Empty
        );
        
        _mockOrderDomainService.Setup(service => service.GetOrderById(It.IsAny<Guid>())).ReturnsAsync("");

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<OrderDoesNotExistError>(result.AsT1.First());
    }

    [Fact]
    public async Task MarkOrderItemFinished_CannotTransition_Failure()
    {
        // ARRANGE
        _mockOrder.OrderItems = [];
        
        var command = new MarkOrderItemFinishedCommand(
            orderId: _mockOrder.Id.Value,
            orderItemId: Guid.Empty
        );

        _mockOrderDomainService.Setup(service => service.GetOrderById(_mockOrder.Id.Value)).ReturnsAsync(_mockOrder);
        _mockOrderDomainService.Setup(service => service.TryOrchestrateTransitionOrderItemStatus(It.IsAny<OrchestrateTransitionOrderItemStatusContract>())).ReturnsAsync("");

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotTransitionOrderItemStatusError>(result.AsT1.First());
    }
}