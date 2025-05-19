import { err, ok, Result } from "neverthrow";
import Order from "../../../domain/models/Order";
import ValueObject from "../../../domain/valueObjects/ValueObject";
import IOrderEventService from "../../interfaces/eventServices/IOrderEventService";
import orderMapper from "../../mappers/orderMapper";
import IEventServiceListenerFn from "../IEventServiceListenerFn";
import IWebsocketEvent from "../IWebsocketEvent";
import CreateOrderEventPayload from "../payloads/orders/CreateOrderEventPayload";
import UpdateOrderEventPayload from "../payloads/orders/UpdateOrderEventPayload";
import TEventServiceListenerIdentifier from "../TEventServiceListenerIdentifier";
import WebsocketSingleton from "../WebsocketSingleton";

class OrderEventServiceEventType extends ValueObject<string> {
    public static readonly CREATED = new OrderEventServiceEventType("orders/create");
    public static readonly UPDATED = new OrderEventServiceEventType("orders/update");

    private static validTypes = new Set([OrderEventServiceEventType.CREATED.value, OrderEventServiceEventType.UPDATED.value]);

    public static canCreate(value: string): Result<undefined, string> {
        const exists = OrderEventServiceEventType.validTypes.has(value);

        if (!exists) {
            return err(`"${value}" is not a valid OrderEventServiceEventType.`);
        }

        return ok(undefined);
    }

    public static executeCreate(value: string): OrderEventServiceEventType {
        const canCreate = this.canCreate(value);

        if (canCreate.isErr()) {
            throw new Error(value);
        }
        
        return new OrderEventServiceEventType(value);
    }
}

const uuidRegistry = new Map<string, OrderEventServiceEventType>();

class OrderEventService implements IOrderEventService {
    private listeners: Map<OrderEventServiceEventType, Set<IEventServiceListenerFn>> = new Map([
        [OrderEventServiceEventType.CREATED, new Set()],
        [OrderEventServiceEventType.UPDATED, new Set()],
    ]);

    constructor(websocketSingleton: WebsocketSingleton) {
        websocketSingleton.socket.addEventListener("message", (wsEvent) => {
            const event: IWebsocketEvent = JSON.parse(wsEvent.data);
            const canCreate = OrderEventServiceEventType.canCreate(event.type);
            if (canCreate.isErr()) {
                return;
            }

            const eventType = OrderEventServiceEventType.executeCreate(event.type);
            const listeners = this.listeners.get(eventType);
            listeners?.forEach((fn) => fn(event));
        });
    }

    registerCreateOrder<T extends (order: Order) => void>(fn: T): TEventServiceListenerIdentifier {
        const listener = (event: IWebsocketEvent) => {
            const payload = event.payload as CreateOrderEventPayload;
            const order = orderMapper.apiToDomain(payload.order);
            fn(order);
        };
        const uuid = crypto.randomUUID();

        this.listeners.push(listener);
        return listener;
    }

    registerUpdateOrder<T extends (order: Order) => void>(fn: T): TEventServiceListenerIdentifier {
        const listener = (event: IWebsocketEvent) => {
            if (event.type === OrderEventServiceEventType.UPDATED) {
                const payload = event.payload as UpdateOrderEventPayload;
                const order = orderMapper.apiToDomain(payload.order);
                fn(order);
            }
        };
        this.listeners.push(listener);
        return listener;
    }

    removeListener(identifier: TEventServiceListenerIdentifier): void {
        this.listeners = this.listeners.filter((listener) => listener !== fn);
    }
}

export default OrderEventService;
