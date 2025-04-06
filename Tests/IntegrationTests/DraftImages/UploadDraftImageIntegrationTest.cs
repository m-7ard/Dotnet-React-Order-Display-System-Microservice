using System.Net;
using System.Net.Http.Json;
using Api.DTOs.DraftImages.UploadImages;
using Application.Common;

namespace Tests.IntegrationTests.DraftImages;

[Collection("Sequential")]
public class UploadDraftImageIntegrationTest : DraftImageIntegrationTest
{
    [Fact]
    public async Task UploadImages_ValidFiles_Success()
    {
        var projectRoot = DirectoryService.GetProjectRoot();
        var appRoot = Path.Combine(projectRoot, "Tests");
        var imageRoute = Path.Combine(
            appRoot,
            "TestFiles",
            "Images",
            "valid-1.jpg"
        );

        using (var file = File.OpenRead(imageRoute))
        using (var content = new StreamContent(file))
        using (var formData = new MultipartFormDataContent())
        {
            formData.Add(content, "Files", "valid-1.jpg");
            var response = await _client.PostAsync($"{_route}/upload_images", formData);

            Assert.NotNull(response);
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);

            var responseContent = await response.Content.ReadFromJsonAsync<UploadDraftImagesResponseDTO>();
            Assert.NotNull(responseContent);
            Assert.NotNull(responseContent.Images);
            Assert.StrictEqual(1, responseContent.Images.Count);
        }
    }

    [Fact]
    public async Task UploadImages_TooLargeFiles_Failure()
    {
        var projectRoot = DirectoryService.GetProjectRoot();
        var appRoot = Path.Combine(projectRoot, "Tests");
        var imageRoute = Path.Combine(
            appRoot,
            "TestFiles",
            "Images",
            "too-large-image.png"
        );

        using (var file = File.OpenRead(imageRoute))
        using (var content = new StreamContent(file))
        using (var formData = new MultipartFormDataContent())
        {
            formData.Add(content, "Files", "too-large-image.png");
            var response = await _client.PostAsync($"{_route}/upload_images", formData);

            Assert.NotNull(response);
            Assert.Equal(HttpStatusCode.RequestEntityTooLarge, response.StatusCode);
        }
    }

    [Fact]
    public async Task UploadImages_InvalidFormat_Failure()
    {
        var projectRoot = DirectoryService.GetProjectRoot();
        var appRoot = Path.Combine(projectRoot, "Tests");
        var imageRoute = Path.Combine(
            appRoot,
            "TestFiles",
            "Images",
            "text-file.txt"
        );

        using (var file = File.OpenRead(imageRoute))
        using (var content = new StreamContent(file))
        using (var formData = new MultipartFormDataContent())
        {
            formData.Add(content, "Files", "text-file.txt");
            var response = await _client.PostAsync($"{_route}/upload_images", formData);

            Assert.NotNull(response);
            Assert.Equal(HttpStatusCode.UnsupportedMediaType, response.StatusCode);
        }
    }

    [Fact]
    public async Task UploadImages_ZeroFilesAttached_Failure()
    {
        using (var formData = new MultipartFormDataContent())
        {
            var response = await _client.PostAsync($"{_route}/upload_images", formData);
            Assert.NotNull(response);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }

    [Fact]
    public async Task UploadImages_TooManyFilesAttached_Failure()
    {
        var projectRoot = DirectoryService.GetProjectRoot();
        var appRoot = Path.Combine(projectRoot, "Tests");
        var imageRoute = Path.Combine(
            appRoot,
            "TestFiles",
            "Images",
            "valid-1.jpg"
        );

        using (var file = File.OpenRead(imageRoute))
        using (var content = new StreamContent(file))
        using (var formData = new MultipartFormDataContent())
        {
            for (var i = 0; i < 9; i++)
            {
                formData.Add(content, "Files", "valid-1.jpg");
            }
            var response = await _client.PostAsync($"{_route}/upload_images", formData);

            Assert.NotNull(response);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}