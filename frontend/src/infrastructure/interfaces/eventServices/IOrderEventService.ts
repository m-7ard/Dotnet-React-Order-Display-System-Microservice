import Order from "../../../domain/models/Order";
import IEventServiceListenerFn from "../../websocket/IEventServiceListenerFn";

export enum OrderEventServiceEventTypes {
    CREATED = "orders/create",
}

interface IOrderEventService {
    registerCreateOrder<T extends (order: Order) => void>(fn: T): IEventServiceListenerFn;
    removeListener(fn: IEventServiceListenerFn): void;
}

export default IOrderEventService;
