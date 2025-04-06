using Application.Contracts.DomainService.ProductDomainService;
using Application.Errors.Objects;
using Application.Handlers.Products.Create;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Moq;

namespace Tests.UnitTests.Application.Api.Products;

public class CreateProductHandlerUnitTest
{
    private readonly Mock<IProductDomainService> _mockProductDomainService;
    private readonly Mock<IProductHistoryDomainService> _mockProductHistoryDomainService;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly CreateProductHandler _handler;

    public CreateProductHandlerUnitTest()
    {
        _mockProductDomainService = new Mock<IProductDomainService>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockProductHistoryDomainService = new Mock<IProductHistoryDomainService>();
    
        var mockProductRepository = new Mock<IProductRepository>();
        var mockProductHistoryRepository = new Mock<IProductHistoryRepository>();

        // Setup IUnitOfWork to return the mocked repositories
        _mockUnitOfWork.Setup(uow => uow.ProductRepository).Returns(mockProductRepository.Object);
        _mockUnitOfWork.Setup(uow => uow.ProductHistoryRepository).Returns(mockProductHistoryRepository.Object);


        _handler = new CreateProductHandler(
            productDomainService: _mockProductDomainService.Object,
            unitOfWork: _mockUnitOfWork.Object,
            productHistoryDomainService: _mockProductHistoryDomainService.Object
        );
    }

    [Fact]
    public async Task CreateProduct_WithoutImages_Success()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(
            seed: 1,
            images: []
        );

        var command = new CreateProductCommand(
            name: mockProduct.Name,
            price: mockProduct.Price.Value,
            description: mockProduct.Description,
            images: [],
            amount: 1
        );

        _mockProductDomainService
            .Setup(service => service.TryOrchestrateCreateProduct(It.IsAny<OrchestrateCreateNewProductContract>()))
            .ReturnsAsync(mockProduct);

        _mockProductHistoryDomainService
            .Setup(service => service.CreateInitialHistoryForProduct(mockProduct))
            .ReturnsAsync(true);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task CreateProduct_WithImages_Success()
    {
        // ARRANGE
        var productImage1 = Mixins.CreateProductImage(1);
        var productImage2 = Mixins.CreateProductImage(2);
        var mockProduct = Mixins.CreateProduct(
            seed: 1,
            images: [productImage1, productImage2]
        );


        var command = new CreateProductCommand(
            name: mockProduct.Name,
            price: mockProduct.Price.Value,
            description: mockProduct.Description,
            images: mockProduct.Images.Select(image => image.FileName.Value).ToList(),
            amount: 1
        );

        _mockProductDomainService.Setup(service => service.TryOrchestrateCreateProduct(It.IsAny<OrchestrateCreateNewProductContract>())).ReturnsAsync(mockProduct);
        _mockProductDomainService.Setup(service => service.TryOrchestrateAddNewProductImage(mockProduct, productImage1.FileName.Value)).ReturnsAsync(true);
        _mockProductDomainService.Setup(service => service.TryOrchestrateAddNewProductImage(mockProduct, productImage2.FileName.Value)).ReturnsAsync(true);

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task CreateProduct_CannotCreateProduct_Failure()
    {
        // ARRANGE
        var productImage1 = Mixins.CreateProductImage(1);

        var mockProduct = Mixins.CreateProduct(
            seed: 1,
            images: []
        );

        _mockProductDomainService.Setup(service => service.TryOrchestrateCreateProduct(It.IsAny<OrchestrateCreateNewProductContract>())).ReturnsAsync("");

        var command = new CreateProductCommand(
            name: mockProduct.Name,
            price: mockProduct.Price.Value,
            description: mockProduct.Description,
            images: ["invalid-file-extension.txt"],
            amount: 1
        );

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotCreateProductError>(result.AsT1.First());
    }

    [Fact]
    public async Task CreateProduct_CannotAddProductImage_Failure()
    {
        // ARRANGE
        var productImage1 = Mixins.CreateProductImage(1);
        var mockProduct = Mixins.CreateProduct(seed: 1,  images: []);

        _mockProductDomainService.Setup(service => service.TryOrchestrateCreateProduct(It.IsAny<OrchestrateCreateNewProductContract>())).ReturnsAsync(mockProduct);
        _mockProductDomainService.Setup(service => service.TryOrchestrateAddNewProductImage(mockProduct, productImage1.FileName.Value)).ReturnsAsync("");

        var command = new CreateProductCommand(
            name: mockProduct.Name,
            price: mockProduct.Price.Value,
            description: mockProduct.Description,
            images: [productImage1.FileName.Value],
            amount: 1
        );

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotAddProductImageError>(result.AsT1.First());
    }

    [Fact]
    public async Task CreateProduct_CannotCreateInitialProductHistory_Failure()
    {
        // ARRANGE
        var productImage1 = Mixins.CreateProductImage(1);
        var mockProduct = Mixins.CreateProduct(seed: 1,  images: []);

        _mockProductDomainService.Setup(service => service.TryOrchestrateCreateProduct(It.IsAny<OrchestrateCreateNewProductContract>())).ReturnsAsync(mockProduct);
        _mockProductDomainService.Setup(service => service.TryOrchestrateAddNewProductImage(mockProduct, productImage1.FileName.Value)).ReturnsAsync(true);
        _mockProductHistoryDomainService.Setup(service => service.CreateInitialHistoryForProduct(mockProduct)).ReturnsAsync("");

        var command = new CreateProductCommand(
            name: mockProduct.Name,
            price: mockProduct.Price.Value,
            description: mockProduct.Description,
            images: [productImage1.FileName.Value],
            amount: 1
        );

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
    Assert.IsType<CannotCreateInitialProductHistoryError>(result.AsT1.First());
    }
}