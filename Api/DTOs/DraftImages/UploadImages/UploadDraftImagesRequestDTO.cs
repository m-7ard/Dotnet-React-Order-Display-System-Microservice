
using Application.Contracts.Models;

namespace Api.DTOs.DraftImages.UploadImages;

public class UploadDraftImagesRequestDTO
{
    public UploadDraftImagesRequestDTO(List<UploadImageData> imageData)
    {
        ImageData = imageData;
    }

    public List<UploadImageData> ImageData { get; set; }
}