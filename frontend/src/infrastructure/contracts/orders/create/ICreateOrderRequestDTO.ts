import IProduct from "../../../../domain/models/IProduct";

export default interface ICreateOrderRequestDTO {
    orderItemData: {
        [productId: number | string]: {
            productId: IProduct["id"];
            quantity: number;
        };
    };
}
