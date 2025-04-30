import { getWebsocketUrl } from "../../viteUtils";

class WebsocketSingleton {
    public readonly socket: WebSocket;
    public open: boolean = false;
    private readonly websocketUrl = `${getWebsocketUrl()}`;

    constructor() {
        this.socket = new WebSocket(this.websocketUrl);
        this.socket.onopen = () => {
            this.open = true;
        };
    }
}

export default WebsocketSingleton;
