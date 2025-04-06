using Application.Errors.Objects;
using Application.Handlers.Products.Delete;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.DomainFactories;
using Moq;

namespace Tests.UnitTests.Application.Api.Products;

public class DeleteProductHandlerUnitTest
{
    private readonly Mock<IProductDomainService> _mockProductDomainService;
    private readonly Mock<IProductHistoryDomainService> _mockProductHistoryDomainService;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly DeleteProductHandler _handler;

    public DeleteProductHandlerUnitTest()
    {
        _mockProductDomainService = new Mock<IProductDomainService>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockProductHistoryDomainService = new Mock<IProductHistoryDomainService>();

        _mockUnitOfWork.Setup(uow => uow.ProductRepository).Returns(new Mock<IProductRepository>().Object);
        _mockUnitOfWork.Setup(uow => uow.ProductHistoryRepository).Returns(new Mock<IProductHistoryRepository>().Object);

        _handler = new DeleteProductHandler(
            productDomainService: _mockProductDomainService.Object,
            unitOfWork: _mockUnitOfWork.Object,
            productHistoryDomainService: _mockProductHistoryDomainService.Object
        );
    }

    [Fact]
    public async Task DeleteProduct_ValidData_Success()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(seed: 1, images: []);
        var mockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(mockProduct);

        var command = new DeleteProductCommand(
            id: mockProduct.Id.Value
        );

        _mockProductDomainService.Setup(service => service.GetProductById(mockProduct.Id.Value)).ReturnsAsync(mockProduct);
        _mockProductDomainService.Setup(service => service.TryOrchestrateDeleteProduct(mockProduct)).ReturnsAsync(true);
        _mockProductHistoryDomainService.Setup(service => service.InvalidateHistoryForProduct(mockProduct)).ReturnsAsync(true);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task DeleteProduct_ProductDoesNotExist_Failure()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(seed: 1, images: []);
        var mockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(mockProduct);

        var command = new DeleteProductCommand(
            id: mockProduct.Id.Value
        );

        _mockProductDomainService.Setup(service => service.GetProductById(mockProduct.Id.Value)).ReturnsAsync("");

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<ProductDoesNotExistError>(result.AsT1.First());
    }
    
    [Fact]
    public async Task DeleteProduct_CannotDelete_Failure()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(seed: 1, images: []);
        var mockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(mockProduct);

        var command = new DeleteProductCommand(
            id: mockProduct.Id.Value
        );

        _mockProductDomainService.Setup(service => service.GetProductById(mockProduct.Id.Value)).ReturnsAsync(mockProduct);
        _mockProductDomainService.Setup(service => service.TryOrchestrateDeleteProduct(mockProduct)).ReturnsAsync("");

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotDeleteProductError>(result.AsT1.First());
    }

    [Fact]
    public async Task DeleteProduct_CannotInvalidProductHistory_Failure()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(seed: 1, images: []);
        var mockProductHistory = ProductHistoryFactory.BuildNewProductHistoryFromProduct(mockProduct);

        var command = new DeleteProductCommand(
            id: mockProduct.Id.Value
        );

        _mockProductDomainService.Setup(service => service.GetProductById(mockProduct.Id.Value)).ReturnsAsync(mockProduct);
        _mockProductDomainService.Setup(service => service.TryOrchestrateDeleteProduct(mockProduct)).ReturnsAsync(true);
        _mockProductHistoryDomainService.Setup(service => service.InvalidateHistoryForProduct(mockProduct)).ReturnsAsync("");

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotInvalidateProductHistoryError>(result.AsT1.First());
    }
}