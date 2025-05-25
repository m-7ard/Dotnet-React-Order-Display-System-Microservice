import Order from "../../../domain/models/Order";
import TEventServiceListenerIdentifier from "../../websocket/TEventServiceListenerIdentifier";

interface IOrderEventService {
    registerCreateOrder<T extends (order: Order) => void>(fn: T): TEventServiceListenerIdentifier;
    registerUpdateOrder<T extends (order: Order) => void>(fn: T): TEventServiceListenerIdentifier;
    removeListener(fn: TEventServiceListenerIdentifier): void;
}

export default IOrderEventService;
