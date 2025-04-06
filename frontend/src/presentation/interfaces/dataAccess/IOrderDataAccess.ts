import ICreateOrderRequestDTO from "../../../infrastructure/contracts/orders/create/ICreateOrderRequestDTO";
import IListOrdersRequestDTO from "../../../infrastructure/contracts/orders/list/IListOrdersRequestDTO";
import IReadOrderRequestDTO from "../../../infrastructure/contracts/orders/read/IReadOrderRequestDTO";
import IMarkOrderItemFinishedRequestDTO from "../../../infrastructure/contracts/orderItems/markFinished/IMarkOrderItemFinishedRequestDTO";
import IMarkOrderFinishedRequestDTO from "../../../infrastructure/contracts/orders/markFinished/IMarkOrderFinishedRequestDTO";

export default interface IOrderDataAccess {
    listOrders(request: IListOrdersRequestDTO): Promise<Response>;
    createOrder(request: ICreateOrderRequestDTO): Promise<Response>;
    markOrderItemFinished(request: IMarkOrderItemFinishedRequestDTO): Promise<Response>;
    markOrderFinished(request: IMarkOrderFinishedRequestDTO): Promise<Response>;
    readOrder(request: IReadOrderRequestDTO): Promise<Response>;
}