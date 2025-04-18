using System.Net;
using System.Net.Http.Json;
using Api.DTOs.DraftImages.UploadImages;
using Application.Contracts.Models;
using Microsoft.EntityFrameworkCore;

namespace Tests.IntegrationTests.DraftImages;

[Collection("Sequential")]
public class UploadDraftImageIntegrationTest : DraftImageIntegrationTest
{
    private UploadDraftImagesRequestDTO _defaultRequest = null!;
    public async override Task InitializeAsync()
    {
        await base.InitializeAsync();
        _defaultRequest = new UploadDraftImagesRequestDTO(imageData: []);
    }

    [Fact]
    public async Task UploadImages_ValidFiles_Success()
    {
        _defaultRequest.ImageData = new List<UploadImageData>()
        {
            new UploadImageData(fileName: "validFileName-1.png", originalFileName: "original-validFileName-1.png", url: "url-1"),
            new UploadImageData(fileName: "validFileName-2.png", originalFileName: "original-validFileName-2.png", url: "url-2")
        };
        var response = await _client.PostAsync($"{_route}/upload_images", JsonContent.Create(_defaultRequest));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var responseContent = await response.Content.ReadFromJsonAsync<UploadDraftImagesResponseDTO>();
        Assert.NotNull(responseContent);

        var db = _factory.CreateDbContext();
        var draftImages = await db.DraftImage.ToListAsync();
        Assert.StrictEqual(2, draftImages.Count);
    }

    [Fact]
    public async Task UploadImages_InvalidFormat_Failure()
    {
        _defaultRequest.ImageData = new List<UploadImageData>()
        {
            new UploadImageData(fileName: "validFileName-1.txt", originalFileName: "original-validFileName-1.txt", url: "url-1")
        };

        var response = await _client.PostAsync($"{_route}/upload_images", JsonContent.Create(_defaultRequest));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.UnsupportedMediaType, response.StatusCode);
    }

    [Fact]
    public async Task UploadImages_ZeroFilesAttached_Failure()
    {
        var response = await _client.PostAsync($"{_route}/upload_images", JsonContent.Create(_defaultRequest));
        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UploadImages_TooManyFilesAttached_Failure()
    {
        for (var i = 0; i < 9; i++)
        {
            _defaultRequest.ImageData.Add(new UploadImageData(fileName: $"valid-{i}.jpg", originalFileName: $"original-valid-{i}.jpg", url: $"url-{i}"));
        }
        var response = await _client.PostAsync($"{_route}/upload_images", JsonContent.Create(_defaultRequest));

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}