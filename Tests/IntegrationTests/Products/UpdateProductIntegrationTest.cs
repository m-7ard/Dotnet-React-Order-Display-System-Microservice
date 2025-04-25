using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Products.Update;
using Application.Interfaces.Persistence;
using Domain.Models;
using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Tests.IntegrationTests.Products;

[Collection("Sequential")]
public class UpdateProductIntegrationTest : ProductsIntegrationTest
{
    private DraftImage _validImage = null!;
    private Product _product001 = null!;
    private ProductHistoryDbEntity _product001History = null!;
    private UpdateProductRequestDTO DefaultRequest = null!;

    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var db = _factory.CreateDbContext();
        var mixins = CreateMixins();
        _validImage = await mixins.CreateDraftImage(
            destinationFileName: "valid-image.png"
        );
        _product001 = await mixins.CreateProductAndProductHistory(number: 1, images: [_validImage]);
        _product001History = await db.ProductHistory.SingleAsync(d => d.ProductId == _product001.Id.Value);
        DefaultRequest = new UpdateProductRequestDTO(
            name: "Product #1 Updated",
            price: (decimal)123.99,
            description: "description Updated",
            images: new List<string>() { _validImage.FileName.Value }
        );
    }

    [Fact]
    public async Task UpdateProduct_ValidDataAndSameImages_Success()
    {
        var request = DefaultRequest;
        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<UpdateProductResponseDTO>();
        Assert.NotNull(content);
        Assert.NotNull(content.Id);

        var db = _factory.CreateDbContext();
        var productHistories = await db.ProductHistory.ToListAsync();
        Assert.StrictEqual(2, productHistories.Count);

        var oldProductHistory = await db.ProductHistory.SingleAsync(d => d.Id == _product001History.Id && d.ValidTo != null);
        Assert.True(oldProductHistory.ValidTo > oldProductHistory.ValidFrom);      

        var newProductHistory = await db.ProductHistory.SingleAsync(d => d.ProductId == _product001.Id.Value && d.ValidTo == null);
        foreach (var image in request.Images)
        {
            Assert.Contains(newProductHistory!.Images, (el) => el == image);
        }  
    }

    [Fact]
    public async Task UpdateProduct_ValidDataAndNewImage_Success()
    {
        var mixins = CreateMixins();
        var newValidImage = await mixins.CreateDraftImage(
            destinationFileName: "new-valid-image.png"
        );
        
        var request = DefaultRequest;
        request.Images = new List<string>(){ _validImage.FileName.Value, newValidImage.FileName.Value };

        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = _factory.Services.CreateScope();
        var repo = scope.ServiceProvider.GetRequiredService<IProductRepository>();
        var updatedProduct = await repo.GetByIdAsync(_product001.Id);
        Assert.NotNull(updatedProduct);

        Assert.Equal(2, updatedProduct.Images.Count);
    
        var db = _factory.CreateDbContext();
        var newProductHistory = await db.ProductHistory.SingleAsync(d => d.ProductId == _product001.Id.Value && d.ValidTo == null);

        foreach (var image in request.Images)
        {
            Assert.Contains(newProductHistory!.Images, (el) => el == image);
        }  
    }

    [Fact]
    public async Task UpdateProduct_ValidDataAndNewImageAndRemoveOldImage_Success()
    {
        var mixins = CreateMixins();
        var newValidImage = await mixins.CreateDraftImage(
            destinationFileName: "new-valid-image.png"
        );
        
        var request = DefaultRequest;
        request.Images = new List<string>(){ newValidImage.FileName.Value };

        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        using var scope = _factory.Services.CreateScope();
        var repo = scope.ServiceProvider.GetRequiredService<IProductRepository>();
        var updatedProduct = await repo.GetByIdAsync(_product001.Id);
        Assert.NotNull(updatedProduct);    

        Assert.StrictEqual(1, updatedProduct.Images.Count);
        Assert.Equal(updatedProduct.Images[0].FileName.Value, newValidImage.FileName.Value);

        var db = _factory.CreateDbContext();
        var newProductHistory = await db.ProductHistory.SingleAsync(d => d.ProductId == _product001.Id.Value && d.ValidTo == null);

        foreach (var image in request.Images)
        {
            Assert.Contains(newProductHistory!.Images, (el) => el == image);
        }  
    }

    [Fact]
    public async Task UpdateProduct_InvalidData_Failure()
    {
        var request = DefaultRequest;
        request.Price = -100;

        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UpdateProduct_InvalidId_Failure()
    {
        var request = DefaultRequest;
        var response = await _client.PutAsync($"{_route}/1000/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateProduct_ValidDataAndRemoveImage_Success()
    {
        var request = DefaultRequest;
        request.Images = new List<string>();

        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        // Check Image model was deleted
        var db = _factory.CreateDbContext();
        var productImage = await db.ProductImage.ToListAsync();
        Assert.True(productImage.Count == 0);
    }
}