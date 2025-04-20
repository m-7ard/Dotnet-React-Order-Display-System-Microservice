import { CLIENT_ID_HEADER_KEY } from "api/middleware/validateTokenMiddleware";
import IUploadDraftImagesRequestDTO from "infrastructure/contracts/draftImages/upload/IUploadDraftImagesRequestDTO";
import IDraftImageDataAccess from "infrastructure/interfaces/IDraftImageDataAccess";

class DraftImageDataAccess implements IDraftImageDataAccess {
    private apiUrl: string;

    constructor(mainAppUrl: string) {
        this.apiUrl = `${mainAppUrl}/api/draft_images`;
    }

    async uploadDraftImages(clientId: string, bearerToken: string, request: IUploadDraftImagesRequestDTO): Promise<Response> {
        return await fetch(`${this.apiUrl}/upload_images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${bearerToken}`,
                [CLIENT_ID_HEADER_KEY]: clientId
            },
            body: JSON.stringify(request),
        });
    }
}

export default DraftImageDataAccess;
