using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Products.Update;
using Api.DTOs.Products.UpdateAmount;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Tests.IntegrationTests.Products;

[Collection("Sequential")]
public class UpdateProductAmountIntegrationTest : ProductsIntegrationTest
{
    private DraftImage _validImage = null!;
    private Product _product001 = null!;
    private UpdateProductAmountRequestDTO DefaultRequest = null!;

    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        var mixins = CreateMixins();
        _validImage = await mixins.CreateDraftImage(
            fileRoute: TestFileRoute.ValidImage,
            destinationFileName: "saved-valid-image.png"
        );
        _product001 = await mixins.CreateProductAndProductHistory(number: 1, images: [_validImage]);
        DefaultRequest = new UpdateProductAmountRequestDTO(
            amount: _product001.Amount.Value + 10
        );
    }

    [Fact]
    public async Task UpdateProductAmount_ValidData_Success()
    {
        // Setup
        var request = DefaultRequest;
        
        // Act
        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update-amount", JsonContent.Create(request));

        // Assert
        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<UpdateProductResponseDTO>();

        var db = _factory.CreateDbContext();
        var productHistories = await db.ProductHistory.ToListAsync();
        Assert.StrictEqual(1, productHistories.Count);

        var updatedProduct = await db.Product.SingleAsync(d => d.Id == _product001.Id.Value);
        Assert.True(updatedProduct.Amount == request.Amount);        
    }

    [Fact]
    public async Task UpdateProductAmount_InvalidAmount_Failure()
    {
        // Setup
        var request = DefaultRequest;
        request.Amount = -1;
        
        // Act
        var response = await _client.PutAsync($"{_route}/{_product001.Id}/update-amount", JsonContent.Create(request));

        // Assert
        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UpdateProductAmount_InvalidId_Failure()
    {
        var request = DefaultRequest;
        var response = await _client.PutAsync($"{_route}/1000/update-amount", JsonContent.Create(request));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}