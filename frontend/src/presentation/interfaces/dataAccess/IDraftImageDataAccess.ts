import IUploadDraftImagesRequestDTO from "../../../infrastructure/contracts/uploadImages/IUploadDraftImagesRequestDTO";

export default interface IDraftImageDataAccess {
    uploadImages(request: IUploadDraftImagesRequestDTO): Promise<Response>;
}
