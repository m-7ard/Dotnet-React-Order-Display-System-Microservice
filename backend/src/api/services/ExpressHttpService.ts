import { CLIENT_ID_HEADER_KEY } from "api/middleware/validateTokenMiddleware";
import { IncomingMessage } from "http";

class ExpressHttpService {
    constructor(private readonly req: IncomingMessage) {}

    getBearerTokenOrThrow(): string {
        const authHeader = this.req.headers["authorization"];
        if (authHeader == null) {
            throw new Error("Cannot obtain bearer token: Auth Header is missing from the request.");
        }

        const [_, token] = authHeader.split(" ");
        if (token == null) {
            throw new Error("Cannot obtain bearer token: Bearer token is missing from the Auth Header.");
        }

        return token;
    }

    getClientHeaderOrThrow(): string {
        const clientId = this.req.headers[CLIENT_ID_HEADER_KEY];
        if (clientId == null) {
            throw new Error(`"${CLIENT_ID_HEADER_KEY}" header is missing from the request.`);
        }

        if (typeof clientId !== "string") {
            throw new Error(`"${CLIENT_ID_HEADER_KEY}" header is must be a string.`);
        }

        return clientId;
    }
}

export default ExpressHttpService;
