import { TokenStorage } from "../../presentation/deps/tokenStorage";
import IDraftImageDataAccess from "../../presentation/interfaces/dataAccess/IDraftImageDataAccess";
import { getApiUrl } from "../../viteUtils";
import IUploadDraftImagesRequestDTO from "../contracts/uploadImages/IUploadDraftImagesRequestDTO";

export default class DraftImageDataAccess implements IDraftImageDataAccess {
    private readonly apiRoute = `${getApiUrl()}`;
    
    constructor(private readonly tokenStorage: TokenStorage) {}

    async uploadImages(request: IUploadDraftImagesRequestDTO): Promise<Response> {
        const formData = new FormData();
        request.files.forEach((file) => formData.append("file", file));
        
        const response = await fetch(`${this.apiRoute}/upload`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${this.tokenStorage.getAccessToken()}`
            },
            body: formData,
        });

        return response;
    }
}