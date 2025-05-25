import { TEventType } from "./EVENT_TYPES";

abstract class AbstractEvent<T> {
    public type: string;
    public abstract payload: T;

    protected constructor(type: TEventType) {
        this.type = type;
    }
}

export default AbstractEvent;
