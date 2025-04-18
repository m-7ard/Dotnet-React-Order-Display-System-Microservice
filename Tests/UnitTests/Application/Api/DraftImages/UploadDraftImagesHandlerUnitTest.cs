using Application.Common;
using Application.Contracts.DomainService.DraftImageDomainService;
using Application.Contracts.Models;
using Application.Errors.Objects;
using Application.Handlers.DraftImages.UploadImages;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Moq;

namespace Tests.UnitTests.Application.Api.DraftImages;

public class UploadDraftImagesHandlerUnitTest
{
    private readonly Mock<IDraftImageDomainService> _mockDraftImageDomainService;
    private readonly Mock<IUnitOfWork> _unitOfWork;
    private readonly UploadDraftImagesHandler _handler;
    private UploadDraftImagesCommand _defaultCommand = null!;

    public UploadDraftImagesHandlerUnitTest()
    {
        _mockDraftImageDomainService = new Mock<IDraftImageDomainService>();
        _unitOfWork = new Mock<IUnitOfWork>();
        _defaultCommand = new UploadDraftImagesCommand(imageData: []);
        
        _handler = new UploadDraftImagesHandler(
            draftImageDomainService: _mockDraftImageDomainService.Object,
            unitOfWork: _unitOfWork.Object
        );
    }

    [Fact]
    public async Task UploadDraftImages_ValidData_Success()
    {
        // ARRANGE
        var mockDraftImage = Mixins.CreateDraftImage(1);

        _mockDraftImageDomainService
            .Setup(service => service.TryOrchestrateCreateNewDraftImage(It.IsAny<OrchestrateCreateNewDraftImageContract>()))
            .ReturnsAsync(mockDraftImage);

        _defaultCommand.ImageData.Add(new UploadImageData(fileName: "validFileName-1.png", originalFileName: "original-validFileName-1.png", url: "url-1"));

        // ACT
        var result = await _handler.Handle(_defaultCommand, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task UploadDraftImages_CannotCreateDraftImage_Failure()
    {
        // ARRANGE
        var mockDraftImage = Mixins.CreateDraftImage(1);

        _mockDraftImageDomainService
            .Setup(service => service.TryOrchestrateCreateNewDraftImage(It.IsAny<OrchestrateCreateNewDraftImageContract>()))
            .ReturnsAsync("");

        _defaultCommand.ImageData.Add(new UploadImageData(fileName: "validFileName-1.txt", originalFileName: "original-validFileName-1.txt", url: "url-1"));

        // ACT
        var result = await _handler.Handle(_defaultCommand, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotCreateDraftImageError>(result.AsT1.First());
    }
}