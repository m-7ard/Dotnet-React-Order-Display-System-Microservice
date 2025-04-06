using Application.Handlers.Products.Read;
using Application.Interfaces.Services;
using Moq;

namespace Tests.UnitTests.Application.Api.Products;

public class ReadProductsHandlerUnitTest
{
    private readonly ReadProductHandler _handler;
    private readonly Mock<IProductDomainService> _mockProductDomainService;

    public ReadProductsHandlerUnitTest()
    {
        _mockProductDomainService = new Mock<IProductDomainService>(); 

        _handler = new ReadProductHandler(
            productDomainService: _mockProductDomainService.Object
        );
    }

    [Fact]
    public async Task ReadProduct_ValidData_Success()
    {
        // ARRANGE
        var mockProduct = Mixins.CreateProduct(seed: 1,  images: []);

        var query = new ReadProductQuery(mockProduct.Id.Value);
        _mockProductDomainService.Setup(service => service.GetProductById(mockProduct.Id.Value)).ReturnsAsync(mockProduct);

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);
        
        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task ReadProduct_ProductDoesNotExist_Failure()
    {
        // ARRANGE
        var query = new ReadProductQuery(Guid.Empty);
        _mockProductDomainService.Setup(service => service.GetProductById(query.Id)).ReturnsAsync("");
    
        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
    }
}