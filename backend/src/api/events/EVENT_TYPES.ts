const EVENT_TYPES = {
    AUTHENTICATE_USER: "AUTHENTICATE_USER",
} as const;

export type TEventType = keyof typeof EVENT_TYPES;

export default EVENT_TYPES;
