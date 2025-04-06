import IDraftImageDataAccess from "../../presentation/interfaces/dataAccess/IDraftImageDataAccess";
import { getApiUrl } from "../../viteUtils";
import IUploadDraftImagesRequestDTO from "../contracts/uploadImages/IUploadDraftImagesRequestDTO";

export default class DraftImageDataAccess implements IDraftImageDataAccess {
    private readonly _apiRoute = `${getApiUrl()}/api/draft_images`;
    
    async uploadImages(request: IUploadDraftImagesRequestDTO): Promise<Response> {
        const formData = new FormData();
        request.files.forEach((file) => formData.append("Files", file));
        
        const response = await fetch(`${this._apiRoute}/upload_images`, {
            method: "POST",
            body: formData
        });

        return response;
    }
}