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
import EVENT_TYPES from "../EVENT_TYPES";

class OrderEventServiceEventType extends ValueObject<string> {
    public static readonly CREATED = new OrderEventServiceEventType(EVENT_TYPES.CREATE_ORDER);
    public static readonly UPDATED = new OrderEventServiceEventType(EVENT_TYPES.UPDATE_ORDER);

    private static validTypes = [OrderEventServiceEventType.CREATED, OrderEventServiceEventType.UPDATED];

    public static canCreate(value: string): Result<OrderEventServiceEventType, string> {
        const eventType = OrderEventServiceEventType.validTypes.find((type) => type.value === value);

        if (eventType == null) {
            return err(`"${value}" is not a valid OrderEventServiceEventType.`);
        }

        return ok(eventType);
    }

    public static executeCreate(value: string): OrderEventServiceEventType {
        const canCreate = this.canCreate(value);

        if (canCreate.isErr()) {
            throw new Error(value);
        }
        
        return canCreate.value;
    }

    public static tryCreate(value: string): Result<OrderEventServiceEventType, string> {
        const canCreate = this.canCreate(value);

        if (canCreate.isErr()) {
            return err(canCreate.error);
        }

        return ok(this.executeCreate(value));
    }
}

const uuidRegistry: Record<string, OrderEventServiceEventType> = {};

class OrderEventService implements IOrderEventService {
    private listeners: Map<OrderEventServiceEventType, Set<IEventServiceListenerFn>> = new Map([
        [OrderEventServiceEventType.CREATED, new Set()],
        [OrderEventServiceEventType.UPDATED, new Set()],
    ]);

    constructor(websocketSingleton: WebsocketSingleton) {
        websocketSingleton.socket.addEventListener("message", (wsEvent) => {
            const event: IWebsocketEvent = JSON.parse(wsEvent.data);
            const canCreate = OrderEventServiceEventType.tryCreate(event.type);

            if (canCreate.isErr()) {
                return;
            }

            const eventType = canCreate.value;
            const listeners = this.listeners.get(eventType);
            listeners?.forEach((fn) => fn(event));
        });
    }

    private addListener(listener: IEventServiceListenerFn, eventType: OrderEventServiceEventType): TEventServiceListenerIdentifier {
        const eventListeners = this.listeners.get(eventType)!;
        eventListeners.add(listener);

        const uuid = crypto.randomUUID();
        uuidRegistry[uuid] = eventType;

        return {
            fn: listener,
            uuid: uuid,
        };
    }

    registerCreateOrder<T extends (order: Order) => void>(fn: T): TEventServiceListenerIdentifier {
        const listener = (event: IWebsocketEvent) => {
            const payload = event.payload as CreateOrderEventPayload;
            const order = orderMapper.apiToDomain(payload.order);
            fn(order);
        };

        return this.addListener(listener, OrderEventServiceEventType.CREATED);
    }

    registerUpdateOrder<T extends (order: Order) => void>(fn: T): TEventServiceListenerIdentifier {
        const listener = (event: IWebsocketEvent) => {
            const payload = event.payload as UpdateOrderEventPayload;
            const order = orderMapper.apiToDomain(payload.order);
            fn(order);
        };

        return this.addListener(listener, OrderEventServiceEventType.UPDATED);
    }

    removeListener(identifier: TEventServiceListenerIdentifier): void {
        const type = uuidRegistry[identifier.uuid];
        const eventListeners = this.listeners.get(type)!;
        eventListeners.delete(identifier.fn);
    }
}

export default OrderEventService;
