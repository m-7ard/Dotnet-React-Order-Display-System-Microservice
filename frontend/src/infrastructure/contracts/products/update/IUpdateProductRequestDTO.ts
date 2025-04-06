import IProduct from "../../../../domain/models/IProduct";

export default interface IUpdateProductRequestDTO {
    id: IProduct["id"];
    name: string;
    price: number;
    description: string;
    images: string[];
}