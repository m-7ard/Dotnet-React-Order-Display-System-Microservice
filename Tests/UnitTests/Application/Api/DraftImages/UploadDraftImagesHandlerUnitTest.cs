using Application.Common;
using Application.Contracts.DomainService.DraftImageDomainService;
using Application.Errors.Objects;
using Application.Handlers.DraftImages.UploadImages;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Moq;

namespace Tests.UnitTests.Application.Api.DraftImages;

public class UploadDraftImagesHandlerUnitTest
{
    private readonly Mock<IDraftImageDomainService> _mockDraftImageDomainService;
    private readonly Mock<IFileStorage> _mockFileStorage;
    private readonly Mock<IUnitOfWork> _unitOfWork;
    private readonly UploadDraftImagesHandler _handler;

    public UploadDraftImagesHandlerUnitTest()
    {
        _mockDraftImageDomainService = new Mock<IDraftImageDomainService>();
        _mockFileStorage = new Mock<IFileStorage>();
        _unitOfWork = new Mock<IUnitOfWork>();
        
        _handler = new UploadDraftImagesHandler(
            draftImageDomainService: _mockDraftImageDomainService.Object,
            fileStorage: _mockFileStorage.Object,
            unitOfWork: _unitOfWork.Object
        );
    }

    [Fact]
    public async Task UploadDraftImages_ValidData_Success()
    {
        // ARRANGE
        var mockDraftImage = Mixins.CreateDraftImage(1);
        var mockFile = new Mock<IFormFile>();
        
        mockFile.Setup(d => d.FileName).Returns("filename.png");

        _mockDraftImageDomainService
            .Setup(service => service.TryOrchestrateCreateNewDraftImage(It.IsAny<OrchestrateCreateNewDraftImageContract>()))
            .ReturnsAsync(mockDraftImage);

        var command = new UploadDraftImagesCommand(
            files: [mockFile.Object]
        );

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);
    }

    [Fact]
    public async Task UploadDraftImages_CannotCreateDraftImage_Failure()
    {
        // ARRANGE
        var mockDraftImage = Mixins.CreateDraftImage(1);
        var mockFile = new Mock<IFormFile>();
        
        mockFile.Setup(d => d.FileName).Returns("filename.txt");

        _mockDraftImageDomainService
            .Setup(service => service.TryOrchestrateCreateNewDraftImage(It.IsAny<OrchestrateCreateNewDraftImageContract>()))
            .ReturnsAsync("");

        var command = new UploadDraftImagesCommand(
            files: [mockFile.Object]
        );

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT1);
        Assert.IsType<CannotCreateDraftImageError>(result.AsT1.First());
    }
}