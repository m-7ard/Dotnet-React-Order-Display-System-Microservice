using Application.Errors;
using MediatR;
using Microsoft.AspNetCore.Http;
using OneOf;

namespace Application.Handlers.DraftImages.UploadImages;

public class UploadDraftImagesCommand : IRequest<OneOf<UploadDraftImagesResult, List<ApplicationError>>>
{
    public UploadDraftImagesCommand(List<IFormFile> files)
    {
        Files = files;
    }

    public List<IFormFile> Files { get; set; }
}