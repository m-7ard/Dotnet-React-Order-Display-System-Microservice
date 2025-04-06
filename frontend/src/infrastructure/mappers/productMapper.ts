import IProduct from "../../domain/models/IProduct";
import IProductApiModel from "../apiModels/IProductApiModel";
import ImageDataMapper from "./productImageMapper";

const productMapper = {
    apiToDomain: (source: IProductApiModel): IProduct => {
        return {
            id: source.id,
            name: source.name,
            price: source.price,
            description: source.description,
            dateCreated: new Date(source.dateCreated),
            images: source.images.map(ImageDataMapper.apiToDomain),
            amount: source.amount
        };
    },
};

export default productMapper;
