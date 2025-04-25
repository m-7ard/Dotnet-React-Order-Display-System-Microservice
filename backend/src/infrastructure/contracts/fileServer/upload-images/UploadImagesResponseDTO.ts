export interface UploadImagesResponseDTO {
    images: Image[];
}

export interface Image {
    url: string;
    fileName: string;
    originalFileName: string;
}
