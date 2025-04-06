import IProduct from "../../../../domain/models/IProduct";
import ProductHistory from "../../../../domain/models/IProductHistory";
import Order from "../../../../domain/models/Order";

export default interface IListOrdersRequestDTO {
    minTotal: number | null;
    maxTotal: number | null;
    status: string | null;
    createdBefore: Date | null;
    createdAfter: Date | null;
    id: Order["id"] | null;
    productId: IProduct["id"] | null;
    productHistoryId: ProductHistory["id"] | null;
    orderBy: string | null;
    orderSerialNumber: number | null;
    orderItemSerialNumber: number | null;
}
