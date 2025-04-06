using Domain.Models;

namespace Application.Handlers.DraftImages.UploadImages;

public class UploadDraftImagesResult
{
    public UploadDraftImagesResult(List<DraftImage> draftImages)
    {
        DraftImage = draftImages;
    }

    public List<DraftImage> DraftImage { get; set; }
}