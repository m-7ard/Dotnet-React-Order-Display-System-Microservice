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
}

export default ExpressHttpService;
