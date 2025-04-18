import IUploadDraftImagesRequestDTO from "infrastructure/contracts/draftImages/upload/IUploadDraftImagesRequestDTO";

interface IDraftImageDataAccess {
    uploadDraftImages(bearerToken: string, request: IUploadDraftImagesRequestDTO): Promise<Response>;
}

export default IDraftImageDataAccess;
