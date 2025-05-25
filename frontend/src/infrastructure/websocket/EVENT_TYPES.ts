const EVENT_TYPES = {
    AUTHENTICATE_USER: "AUTHENTICATE_USER",
    CREATE_ORDER: "orders/create",
    UPDATE_ORDER: "orders/update"
} as const;

export type TEventType = keyof typeof EVENT_TYPES;

export default EVENT_TYPES;
