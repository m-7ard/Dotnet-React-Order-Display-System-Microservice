class WebsocketSingleton {
    public readonly socket: WebSocket;
    public open: boolean = false;

    constructor() {
        this.socket = new WebSocket("ws://localhost:8080");
        this.socket.onopen = () => {
            this.open = true;
        };
    }
}

export default WebsocketSingleton;
