import { Channel } from "amqplib";
import EnsureApplicationReadyEvent from "infrastructure/events/payloads/EnsureApplicationReadyEvent";

class QueueService {
    constructor(private readonly channel: Channel) {}

    ensureApplicationReady(userId: string): void {
        const event = new EnsureApplicationReadyEvent({ userId: userId }) 
        this.channel.sendToQueue("apiQueue", Buffer.from(JSON.stringify(event)));
        console.log("Sent the event: ", event);
    }
}

export default QueueService;
