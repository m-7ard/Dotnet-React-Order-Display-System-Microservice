using Api.ApiModels;

namespace Api.DTOs.DraftImages.UploadImages;

public class UploadDraftImagesResponseDTO
{
    public UploadDraftImagesResponseDTO(List<ImageApiModel> images)
    {
        Images = images;
    }

    public List<ImageApiModel> Images { get; set; }
}