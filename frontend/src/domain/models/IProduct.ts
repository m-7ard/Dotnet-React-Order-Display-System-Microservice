import IImageData from "./IImageData";

export default interface IProduct {
    id: string,
    name: string,
    price: number,
    description: string,
    dateCreated: Date,
    images: IImageData[],
    amount: number
}