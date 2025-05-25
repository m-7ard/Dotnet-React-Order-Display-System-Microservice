import AbstractEvent from "../AbstractEvent";
import EVENT_TYPES from "../EVENT_TYPES";

export interface EnsureApplicationReadyPayload {
    userId: string;
}

class EnsureApplicationReadyEvent extends AbstractEvent<EnsureApplicationReadyPayload> {
    public override payload: EnsureApplicationReadyPayload;

    constructor(payload: EnsureApplicationReadyPayload) {
        super(EVENT_TYPES.ENSURE_APPLICATION_READY);
        this.payload = payload;
    }
}

export default EnsureApplicationReadyEvent;
