interface IImageData {
    fileName: string;  
    originalFileName: string;  
    url: string;
}

interface IUploadDraftImagesRequestDTO {
    imageData: Array<IImageData>;
}

export default IUploadDraftImagesRequestDTO;