import IProduct from "../../../../domain/models/IProduct";

export default interface IListProductHistoriesRequestDTO {
    name: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    description: string | null;
    validTo: Date | null;
    validFrom: Date | null;
    productId: IProduct["id"] | null;
    orderBy: string | null;
}