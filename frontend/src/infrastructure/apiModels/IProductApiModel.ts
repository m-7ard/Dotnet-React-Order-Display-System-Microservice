import IImageApiModel from "./IImageApiModel";

export default interface IProductApiModel {
    id: string;
    name: string;
    price: number;
    description: string;
    dateCreated: string;
    images: IImageApiModel[];
    amount: number;
}
