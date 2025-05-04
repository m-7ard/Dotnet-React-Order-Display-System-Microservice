import IWebsocketEvent from "./IWebsocketEvent";

interface IEventServiceListenerFn {
    (event: IWebsocketEvent): void;
}

export default IEventServiceListenerFn;