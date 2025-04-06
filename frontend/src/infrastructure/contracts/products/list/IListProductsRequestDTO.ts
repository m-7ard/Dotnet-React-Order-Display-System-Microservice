import IProduct from "../../../../domain/models/IProduct";

export default interface IListProductsRequestDTO {
    id: IProduct["id"] | null;
    name: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    description: string | null;
    createdBefore: Date | null;
    createdAfter: Date | null;
    orderBy: string | null;
}