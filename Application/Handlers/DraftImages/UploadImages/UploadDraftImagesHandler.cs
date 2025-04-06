using Application.Common;
using Application.Contracts.DomainService.DraftImageDomainService;
using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using OneOf;

namespace Application.Handlers.DraftImages.UploadImages;

public class UploadDraftImagesHandler : IRequestHandler<UploadDraftImagesCommand, OneOf<UploadDraftImagesResult, List<ApplicationError>>>
{
    private readonly IDraftImageDomainService _draftImageDomainService;
    private readonly IFileStorage _fileStorage;
    private readonly IUnitOfWork _unitOfWork;

    public UploadDraftImagesHandler(IDraftImageDomainService draftImageDomainService, IFileStorage fileStorage, IUnitOfWork unitOfWork)
    {
        _draftImageDomainService = draftImageDomainService;
        _fileStorage = fileStorage;
        _unitOfWork = unitOfWork;
    }

    public async Task<OneOf<UploadDraftImagesResult, List<ApplicationError>>> Handle(UploadDraftImagesCommand request, CancellationToken cancellationToken)
    {
        var errors = new List<ApplicationError>();
        var draftImages = new List<Tuple<IFormFile, DraftImage>>();

        foreach (var file in request.Files)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            var uniqueFileName = Guid.NewGuid().ToString();
            var generatedFileName = $"{uniqueFileName}{fileExtension}";
            
            var contract = new OrchestrateCreateNewDraftImageContract(fileName: generatedFileName, originalFileName: file.FileName, url: $"Media/{generatedFileName}");
            var tryOrchestrateCreate = await _draftImageDomainService.TryOrchestrateCreateNewDraftImage(contract);
            if (tryOrchestrateCreate.IsT1)
            {
                errors.Add(new CannotCreateDraftImageError(message: tryOrchestrateCreate.AsT1, path: [file.FileName]));
            }
            else
            {
                draftImages.Add(new Tuple<IFormFile, DraftImage>(file, tryOrchestrateCreate.AsT0));
            }
        }

        if (errors.Count > 0)
        {
            return errors;
        }

        foreach (var (file, draftImage) in draftImages)
        {
            var filePath = Path.Combine(DirectoryService.GetMediaDirectory(), draftImage.FileName.Value);
            await _fileStorage.SaveFile(file, filePath, cancellationToken);
        }

        await _unitOfWork.SaveAsync();

        return new UploadDraftImagesResult(draftImages: draftImages.Select(tuple => tuple.Item2).ToList());
    }
}