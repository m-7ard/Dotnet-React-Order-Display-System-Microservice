import ProductHistory from "../../domain/models/IProductHistory";
import IProductHistoryApiModel from "../apiModels/IProductHistoryApiModel";

const productHistoryMapper = {
    apiToDomain: (source: IProductHistoryApiModel): ProductHistory => {
        return new ProductHistory({
            id: source.id,
            name: source.name,
            images: source.images,
            description: source.description,
            price: source.price,
            productId: source.productId,
            validFrom: new Date(source.validFrom),
            validTo: source.validTo == null ? null : new Date(source.validTo),
        });
    },
};

export default productHistoryMapper;
