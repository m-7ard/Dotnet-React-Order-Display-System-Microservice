using Application.Contracts.DomainService.DraftImageDomainService;
using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using MediatR;
using OneOf;

namespace Application.Handlers.DraftImages.UploadImages;

public class UploadDraftImagesHandler : IRequestHandler<UploadDraftImagesCommand, OneOf<UploadDraftImagesResult, List<ApplicationError>>>
{
    private readonly IDraftImageDomainService _draftImageDomainService;
    private readonly IUnitOfWork _unitOfWork;

    public UploadDraftImagesHandler(IDraftImageDomainService draftImageDomainService, IUnitOfWork unitOfWork)
    {
        _draftImageDomainService = draftImageDomainService;
        _unitOfWork = unitOfWork;
    }

    public async Task<OneOf<UploadDraftImagesResult, List<ApplicationError>>> Handle(UploadDraftImagesCommand request, CancellationToken cancellationToken)
    {
        var errors = new List<ApplicationError>();

        foreach (var imageData in request.ImageData)
        {
            var contract = new OrchestrateCreateNewDraftImageContract(fileName: imageData.FileName, originalFileName: imageData.OriginalFileName, url: imageData.Url);
            var tryOrchestrateCreate = await _draftImageDomainService.TryOrchestrateCreateNewDraftImage(contract);
            if (tryOrchestrateCreate.IsT1)
            {
                errors.Add(new CannotCreateDraftImageError(message: tryOrchestrateCreate.AsT1, path: [imageData.FileName]));
            }
        }

        if (errors.Count > 0)
        {
            return errors;
        }

        await _unitOfWork.SaveAsync();

        return new UploadDraftImagesResult();
    }
}