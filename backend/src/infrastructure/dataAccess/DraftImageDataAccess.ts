import IUploadDraftImagesRequestDTO from "infrastructure/contracts/draftImages/upload/IUploadDraftImagesRequestDTO";
import IDraftImageDataAccess from "infrastructure/interfaces/IDraftImageDataAccess";

class DraftImageDataAccess implements IDraftImageDataAccess {
    private apiUrl: string;

    constructor() {
        const apiUrl = process.env.API_URL;
        if (apiUrl == null) {
            throw new Error("Apis Url was not configured.");
        }

        this.apiUrl = `${apiUrl}/api/draft_images`;
    }

    async uploadDraftImages(bearerToken: string, request: IUploadDraftImagesRequestDTO): Promise<Response> {
        return await fetch(`${this.apiUrl}/upload_images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify(request),
        });
    }
}

export default DraftImageDataAccess;
