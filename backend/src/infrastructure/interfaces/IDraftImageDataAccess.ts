import IUploadDraftImagesRequestDTO from "infrastructure/contracts/draftImages/upload/IUploadDraftImagesRequestDTO";

interface IDraftImageDataAccess {
    uploadDraftImages(clientId: string, bearerToken: string, request: IUploadDraftImagesRequestDTO): Promise<Response>;
}

export default IDraftImageDataAccess;
