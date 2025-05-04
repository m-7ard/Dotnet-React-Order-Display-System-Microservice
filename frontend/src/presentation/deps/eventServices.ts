import OrderEventService from "../../infrastructure/websocket/services/OrderEventService";
import WebsocketSingleton from "../../infrastructure/websocket/WebsocketSingleton";

export const websocketSingleton = new WebsocketSingleton();
export const orderEventService = new OrderEventService(websocketSingleton);
