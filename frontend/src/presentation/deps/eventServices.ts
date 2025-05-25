import OrderEventService from "../../infrastructure/websocket/services/OrderEventService";
import WebsocketProducerService from "../../infrastructure/websocket/services/WebsocketProducerService";
import WebsocketSingleton from "../../infrastructure/websocket/WebsocketSingleton";

export const websocketSingleton = new WebsocketSingleton();
export const websocketProducerService = new WebsocketProducerService(websocketSingleton);
export const orderEventService = new OrderEventService(websocketSingleton);
