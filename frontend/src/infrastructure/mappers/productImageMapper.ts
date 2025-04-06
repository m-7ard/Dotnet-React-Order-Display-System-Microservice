import IImageData from "../../domain/models/IImageData";
import IImageApiModel from "../apiModels/IImageApiModel";

const ImageDataMapper = {
    apiToDomain: (source: IImageApiModel): IImageData => {
        return {
            fileName: source.fileName,
            originalFileName: source.originalFileName,
            url: source.url
        };
    },
};

export default ImageDataMapper;
