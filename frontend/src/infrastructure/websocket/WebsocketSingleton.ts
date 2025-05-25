import { getWebsocketUrl } from "../../viteUtils";

class WebsocketSingleton {
    public readonly socket: WebSocket;
    public open: boolean = false;
    private readonly websocketUrl = `${getWebsocketUrl()}`;
    private readonly onToggles: Array<(open: boolean) => void> = [];
    private readonly onOpens : Array<(open: boolean) => void> = [];

    constructor() {
        this.socket = new WebSocket(this.websocketUrl);
        this.socket.onopen = () => {
            this.open = true;
            this.onToggles.forEach((fn) => fn(true));
            this.onOpens.forEach((fn) => fn(true))
        };
        
        this.socket.onclose = () => {
            this.open = false;
            this.onToggles.forEach((fn) => fn(false));
        };
    }

    sendJSON(data: object) {
        const fn = () => this.socket.send(JSON.stringify(data));
        
        if (!this.open) {
            this.onOpens.push(fn)
            return;
        }
        
        fn();
    }

    registerOnToggle(fn: (open: boolean) => void) {
        this.onToggles.push(fn);
    }
}

export default WebsocketSingleton;
