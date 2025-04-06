import IProductApiModel from "./IProductApiModel";

export default interface IProductHistoryApiModel {
    id: string;
    name: string;
    images: string[];
    description: string;
    price: number;
    productId: IProductApiModel["id"];
    validFrom: string;
    validTo: string | null;
}