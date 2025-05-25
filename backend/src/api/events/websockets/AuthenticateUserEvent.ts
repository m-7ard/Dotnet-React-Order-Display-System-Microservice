import AbstractEvent from "../AbstractEvent";
import EVENT_TYPES from "../EVENT_TYPES";

export interface AuthenticateUserPayload {
    token: string;
}

class AuthenticateUserEvent extends AbstractEvent<AuthenticateUserPayload> {
    public override payload: AuthenticateUserPayload;

    constructor(payload: AuthenticateUserPayload) {
        super(EVENT_TYPES.AUTHENTICATE_USER);
        this.payload = payload;
    }
}

export default AuthenticateUserEvent;
