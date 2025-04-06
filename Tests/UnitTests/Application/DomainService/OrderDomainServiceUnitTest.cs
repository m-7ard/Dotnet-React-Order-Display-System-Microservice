using Application.Contracts.DomainService.OrderDomainService;
using Application.DomainService;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.DomainFactories;
using Moq;

namespace Tests.UnitTests.Application.DomainService;

public class OrderDomainServiceUnitTest
{
    private readonly OrderDomainService _orderDomainService;
    private readonly Mock<IProductDomainService> _mockProductDomainService;
    private readonly Mock<IProductHistoryDomainService> _mockProductHistoryDomainService;
    private readonly Mock<ISequenceService> _mockSequenceService;
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly Mock<IOrderRepository> _mockOrderRepository;

    public OrderDomainServiceUnitTest()
    {
        _mockProductDomainService = new Mock<IProductDomainService>();
        _mockProductHistoryDomainService = new Mock<IProductHistoryDomainService>();
        _mockSequenceService = new Mock<ISequenceService>();
        _mockOrderRepository = new Mock<IOrderRepository>();

        _mockSequenceService.Setup(service => service.GetNextOrderItemValueAsync()).ReturnsAsync(1);
        _mockSequenceService.Setup(service => service.GetNextOrderItemValueAsync()).ReturnsAsync(1);

        _mockProductRepository = new Mock<IProductRepository>();

        _orderDomainService = new OrderDomainService(
            productDomainService: _mockProductDomainService.Object,
            productHistoryDomainService: _mockProductHistoryDomainService.Object,
            sequenceService: _mockSequenceService.Object,
            productRepository: _mockProductRepository.Object,
            orderRepository: _mockOrderRepository.Object
        );
    }

    // -------------------------------
    // Create New Order

    [Fact]
    public async Task TryOrchestrateCreateNewOrder_ValidData_Success()
    {
        // ARRANGE


        // ACT
        var result = await _orderDomainService.TryOrchestrateCreateNewOrder(Guid.NewGuid());
        
        // ASSERT
        Assert.True(result.IsT0);
    }

    // -------------------------------
    // Add New Order Item

    [Fact]
    public async Task TryOrchestrateAddNewOrderItem_ValidData_Success()
    {
        // ARRANGE
        var mockOrder = Mixins.CreateNewOrderWithoutItem(1);
        var mockProduct = Mixins.CreateProduct(seed: 1, images: []);
        var contract = new OrchestrateAddNewOrderItemContract(
            order: mockOrder,
            productId: Guid.Empty,
            quantity: 1
        );

        _mockProductDomainService.Setup(service => service.GetProductById(Guid.Empty)).ReturnsAsync(() => mockProduct);
        _mockProductHistoryDomainService.Setup(service => service.GetLatestProductHistoryForProduct(mockProduct)).ReturnsAsync(() => ProductHistoryFactory.BuildNewProductHistoryFromProduct(mockProduct));

        // ACT
        var result = await _orderDomainService.TryOrchestrateAddNewOrderItem(contract: contract);
        
        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task TryOrchestrateAddNewOrderItem_QuantityLargerThanProductAmount_Failure()
    {
        // ARRANGE
        var mockOrder = Mixins.CreateNewOrderWithoutItem(1);
        var mockProduct = Mixins.CreateProduct(seed: 1, images: []);
        var contract = new OrchestrateAddNewOrderItemContract(
            order: mockOrder,
            productId: Guid.Empty,
            quantity: mockProduct.Amount.Value + 1
        );

        _mockProductDomainService.Setup(service => service.GetProductById(Guid.Empty)).ReturnsAsync(() => mockProduct);
        _mockProductHistoryDomainService.Setup(service => service.GetLatestProductHistoryForProduct(mockProduct)).ReturnsAsync(() => ProductHistoryFactory.BuildNewProductHistoryFromProduct(mockProduct));

        // ACT
        var result = await _orderDomainService.TryOrchestrateAddNewOrderItem(contract: contract);
        
        // ASSERT
        Assert.True(result.IsT1);
    }
}