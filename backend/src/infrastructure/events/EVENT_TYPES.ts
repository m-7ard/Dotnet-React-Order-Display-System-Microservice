const EVENT_TYPES = {
    ENSURE_APPLICATION_READY: "ENSURE_APPLICATION_READY",
} as const;

export type TEventType = keyof typeof EVENT_TYPES;

export default EVENT_TYPES;
