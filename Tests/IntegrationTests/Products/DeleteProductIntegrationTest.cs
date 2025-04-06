using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Products.Delete;
using Domain.Models;
using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;

namespace Tests.IntegrationTests.Products;

[Collection("Sequential")]
public class DeleteProductIntegrationTest : ProductsIntegrationTest
{
    private DraftImage _validImage = null!;
    private Product _product001 = null!;
    private ProductHistoryDbEntity _product001History = null!;
    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var db = _factory.CreateDbContext();
        var mixins = CreateMixins();
        _validImage = await mixins.CreateDraftImage(
            fileRoute: TestFileRoute.ValidImage,
            destinationFileName: "saved-valid-image.png"
        );
        _product001 = await mixins.CreateProductAndProductHistory(number: 1, images: [_validImage]);
        _product001History = await db.ProductHistory.SingleAsync(d => d.ProductId == _product001.Id.Value);
    }

    [Fact]
    public async Task DeleteProduct_ValidData_Success()
    {
        var request = new DeleteProductRequestDTO();
        var response = await _client.PostAsync($"{_route}/{_product001.Id}/delete", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var db = _factory.CreateDbContext();
        var product = await db.Product.SingleOrDefaultAsync(dbProduct => dbProduct.Id == _product001.Id.Value);
        Assert.Null(product);

        foreach (var productImage in _product001.Images)
        {
            var retrievedImage = await db.ProductImage.SingleOrDefaultAsync(dbImage => dbImage.Id == productImage.Id.Value);
            Assert.Null(retrievedImage);
        }
        
        var updatedProductHistory = await db.ProductHistory.SingleAsync(d => d.Id == _product001History.Id);
        Assert.True(updatedProductHistory.ValidTo > updatedProductHistory.ValidFrom);     
    }

    [Fact]
    public async Task DeleteProduct_NonExistingId_Failure()
    {
        var request = new DeleteProductRequestDTO();
        var response = await _client.PostAsync($"{_route}/10000/delete", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteProduct_InvalidId_Failure()
    {
        var request = new DeleteProductRequestDTO();
        var response = await _client.PostAsync($"{_route}/invalid/delete", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}