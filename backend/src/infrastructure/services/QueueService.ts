import { Channel } from "amqplib";

class QueueService {
    constructor(private readonly channel: Channel) {}

    ensureApplicationReady(userId: string): void {
        const event: IEnsureApplicationReady = { userId: userId } 
        this.channel.sendToQueue("apiQueue", Buffer.from(JSON.stringify(event)));
        console.log("Sent the event: ", userId);
    }
}

export default QueueService;
