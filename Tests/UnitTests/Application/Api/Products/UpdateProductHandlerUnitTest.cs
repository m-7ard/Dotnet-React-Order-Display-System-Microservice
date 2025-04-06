using Application.Contracts.DomainService.ProductDomainService;
using Application.Errors.Objects;
using Application.Handlers.Products.Update;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Moq;

namespace Tests.UnitTests.Application.Api.Products;

public class UpdateProductHandlerUnitTest
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IProductDomainService> _mockProductDomainService;
    private readonly Mock<IProductHistoryDomainService> _mockProductDHistoryomainService;
    private readonly UpdateProductHandler _handler;

    public UpdateProductHandlerUnitTest()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockProductDomainService = new Mock<IProductDomainService>();
        _mockProductDHistoryomainService = new Mock<IProductHistoryDomainService>();

        _handler = new UpdateProductHandler(
            unitOfWork: _mockUnitOfWork.Object,
            productDomainService: _mockProductDomainService.Object,
            productHistoryDomainService: _mockProductDHistoryomainService.Object
        );
    }

    [Fact]
    public async Task UpdateProduct_ValidData_Success()
    {
        // ARRANGE
        var newMockProduct = Mixins.CreateProduct(seed: 1, [Mixins.CreateProductImage(1)]);

        var query = new UpdateProductCommand(
            id: newMockProduct.Id.Value,
            name: newMockProduct.Name,
            price: newMockProduct.Price.Value,
            description: newMockProduct.Description,
            images: []
        );

        _mockProductDomainService
            .Setup(service => service.GetProductById(newMockProduct.Id.Value))
            .ReturnsAsync(() => newMockProduct);

        _mockProductDomainService
            .Setup(service => service.TryOrchestrateUpdateProduct(newMockProduct, It.IsAny<OrchestrateUpdateProductContract>()))
            .ReturnsAsync(() => true);
            
        _mockProductDomainService
            .Setup(service => service.TryOrchestrateUpdateImages(newMockProduct, query.Images))
            .ReturnsAsync(() => true);

        _mockProductDHistoryomainService
            .Setup(service => service.ToggleNewHistoryForProduct(newMockProduct))
            .ReturnsAsync(true);

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task UpdateProduct_CannoUpdateImages_Failure()
    {
        // ARRANGE
        var newMockProduct = Mixins.CreateProduct(seed: 1, [Mixins.CreateProductImage(1)]);

        var query = new UpdateProductCommand(
            id: newMockProduct.Id.Value,
            name: newMockProduct.Name,
            price: newMockProduct.Price.Value,
            description: newMockProduct.Description,
            images: []
        );

        _mockProductDomainService
            .Setup(service => service.GetProductById(newMockProduct.Id.Value))
            .ReturnsAsync(() => newMockProduct);

        _mockProductDomainService
            .Setup(service => service.TryOrchestrateUpdateProduct(newMockProduct, It.IsAny<OrchestrateUpdateProductContract>()))
            .ReturnsAsync(() => true);
            
        _mockProductDomainService
            .Setup(service => service.TryOrchestrateUpdateImages(newMockProduct, query.Images))
            .ReturnsAsync(() => new List<string>(){ "" });

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotUpdateProductImagesError>(result.AsT1.First());
    }

    [Fact]
    public async Task UpdateProduct_CannotUpdateProduct_Failure()
    {
        // ARRANGE
        var newMockProduct = Mixins.CreateProduct(seed: 1, [Mixins.CreateProductImage(1)]);

        var query = new UpdateProductCommand(
            id: newMockProduct.Id.Value,
            name: newMockProduct.Name,
            price: newMockProduct.Price.Value,
            description: newMockProduct.Description,
            images: []
        );

        _mockProductDomainService
            .Setup(service => service.GetProductById(newMockProduct.Id.Value))
            .ReturnsAsync(() => newMockProduct);

        _mockProductDomainService
            .Setup(service => service.TryOrchestrateUpdateProduct(newMockProduct, It.IsAny<OrchestrateUpdateProductContract>()))
            .ReturnsAsync(() => "");
            

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotUpdateProductError>(result.AsT1.First());
    }

    [Fact]
    public async Task UpdateProduct_ProductDoesNotExist_Failure()
    {
        // ARRANGE
        var newMockProduct = Mixins.CreateProduct(seed: 1, [Mixins.CreateProductImage(1)]);

        var query = new UpdateProductCommand(
            id: newMockProduct.Id.Value,
            name: newMockProduct.Name,
            price: newMockProduct.Price.Value,
            description: newMockProduct.Description,
            images: []
        );

        _mockProductDomainService
            .Setup(service => service.GetProductById(newMockProduct.Id.Value))
            .ReturnsAsync(() => "");

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<ProductDoesNotExistError>(result.AsT1.First());
    }

    [Fact]
    public async Task UpdateProduct_CannotCreateHistory_Failure()
    {
        // ARRANGE
        var newMockProduct = Mixins.CreateProduct(seed: 1, [Mixins.CreateProductImage(1)]);

        var query = new UpdateProductCommand(
            id: newMockProduct.Id.Value,
            name: newMockProduct.Name,
            price: newMockProduct.Price.Value,
            description: newMockProduct.Description,
            images: []
        );

        _mockProductDomainService
            .Setup(service => service.GetProductById(newMockProduct.Id.Value))
            .ReturnsAsync(() => newMockProduct);

        _mockProductDomainService
            .Setup(service => service.TryOrchestrateUpdateProduct(newMockProduct, It.IsAny<OrchestrateUpdateProductContract>()))
            .ReturnsAsync(() => true);
            
        _mockProductDomainService
            .Setup(service => service.TryOrchestrateUpdateImages(newMockProduct, query.Images))
            .ReturnsAsync(() => true);

        _mockProductDHistoryomainService
            .Setup(service => service.ToggleNewHistoryForProduct(newMockProduct))
            .ReturnsAsync("");

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotToggleNewProductHistoryError>(result.AsT1.First());
    }
}