using Application.Errors.Objects;
using Application.Handlers.Products.UpdateAmount;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.Models;
using Domain.ValueObjects.Shared;
using Moq;

namespace Tests.UnitTests.Application.Api.Products;

public class UpdateProductAmountHandlerUnitTest
{
    private readonly Mock<IProductDomainService> _mockProductDomainService;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly UpdateProductAmountHandler _handler;
    private readonly Product _PRODUCT_001;
    private readonly Quantity _PRODUCT_001_ORIGINAL_AMOUNT;

    public UpdateProductAmountHandlerUnitTest()
    {
        _mockProductDomainService = new Mock<IProductDomainService>(); 
        _mockUnitOfWork = new Mock<IUnitOfWork>();

        _mockUnitOfWork.Setup(mock => mock.ProductRepository).Returns(new Mock<IProductRepository>().Object);

        _PRODUCT_001 = Mixins.CreateProduct(seed: 1, images: []);
        _PRODUCT_001_ORIGINAL_AMOUNT = _PRODUCT_001.Amount;
        
        _handler = new UpdateProductAmountHandler(
            unitOfWork: _mockUnitOfWork.Object,
            productDomainService: _mockProductDomainService.Object
        );
    }

    [Fact]
    public async Task UpdateProductAmount_ValidData_Success()
    {
        // ARRANGE
        var command = new UpdateProductAmountCommand(
            id: _PRODUCT_001.Id.Value,
            amount: _PRODUCT_001.Amount.Value + 1
        );

        _mockProductDomainService.Setup(service => service.GetProductById(_PRODUCT_001.Id.Value)).ReturnsAsync(_PRODUCT_001);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task UpdateProductAmount_InvalidAmount_Failure()
    {
        // ARRANGE
        var command = new UpdateProductAmountCommand(
            id: _PRODUCT_001.Id.Value,
            amount: -1
        );

        _mockProductDomainService.Setup(service => service.GetProductById(_PRODUCT_001.Id.Value)).ReturnsAsync(_PRODUCT_001);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotUpdateProductError>(result.AsT1.First());
    }
}