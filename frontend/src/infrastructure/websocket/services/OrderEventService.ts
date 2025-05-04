import Order from "../../../domain/models/Order";
import IOrderEventService, { OrderEventServiceEventTypes } from "../../interfaces/eventServices/IOrderEventService";
import orderMapper from "../../mappers/orderMapper";
import IEventServiceListenerFn from "../IEventServiceListenerFn";
import IWebsocketEvent from "../IWebsocketEvent";
import CreateOrderEventPayload from "../payloads/orders/CreateOrderEventPayload";
import UpdateOrderEventPayload from "../payloads/orders/UpdateOrderEventPayload";
import WebsocketSingleton from "../WebsocketSingleton";

class OrderEventService implements IOrderEventService {
    private listeners: Array<(event: IWebsocketEvent) => void> = [];

    constructor(websocketSingleton: WebsocketSingleton) {
        websocketSingleton.socket.addEventListener("message", (event) => {
            const data: IWebsocketEvent = JSON.parse(event.data);
            this.listeners.map((fn) => fn(data));
        });
    }

    registerCreateOrder<T extends (order: Order) => void>(fn: T): IEventServiceListenerFn {
        const listener = (event: IWebsocketEvent) => {
            if (event.type === OrderEventServiceEventTypes.CREATED) {
                const payload = event.payload as CreateOrderEventPayload;
                const order = orderMapper.apiToDomain(payload.order);
                fn(order);
            }
        };
        this.listeners.push(listener);
        return listener;
    }

    registerUpdateOrder<T extends (order: Order) => void>(fn: T): IEventServiceListenerFn {
        const listener = (event: IWebsocketEvent) => {
            if (event.type === OrderEventServiceEventTypes.UPDATED) {
                const payload = event.payload as UpdateOrderEventPayload;
                const order = orderMapper.apiToDomain(payload.order);
                fn(order);
            }
        };
        this.listeners.push(listener);
        return listener;
    }

    removeListener(fn: IEventServiceListenerFn): void {
        this.listeners = this.listeners.filter((listener) => listener !== fn);
    }
}

export default OrderEventService;
