using Application.Contracts.Models;
using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.DraftImages.UploadImages;

public class UploadDraftImagesCommand : IRequest<OneOf<UploadDraftImagesResult, List<ApplicationError>>>
{
    public UploadDraftImagesCommand(List<UploadImageData> imageData)
    {
        ImageData = imageData;
    }

    public List<UploadImageData> ImageData { get; set; }
}