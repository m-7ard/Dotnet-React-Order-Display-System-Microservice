import IWebsocketProducerService from "../../interfaces/eventServices/IWebsocketProducerService";
import AuthenticateUserEvent from "../events/manage/AuthenticateUserEvent";
import WebsocketSingleton from "../WebsocketSingleton";

class WebsocketProducerService implements IWebsocketProducerService {
    constructor(private readonly websocketSingleton: WebsocketSingleton) {}
    
    public authenticateUser(token: string): void {
        const event = new AuthenticateUserEvent({ token: token });
        this.websocketSingleton.sendJSON(event);
    }
}

export default WebsocketProducerService;
