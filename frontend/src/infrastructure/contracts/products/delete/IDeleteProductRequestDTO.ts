import IProduct from "../../../../domain/models/IProduct";

export default interface IDeleteProductRequestDTO {
    id: IProduct["id"];
}