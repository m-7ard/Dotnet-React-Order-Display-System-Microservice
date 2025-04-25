import { TokenValidationErrorCode, TokenValidationService } from "api/services/TokenValidationService";
import { NextFunction, Request, Response } from "express";

export const CLIENT_ID_HEADER_KEY = "X-Client-Id";

export function validateTokenMiddlewareFactory(props: { tokenValidationService: TokenValidationService }) {
    async function validateTokenMiddleware(req: Request, res: Response, next: NextFunction) {
        const result = await tokenValidationService.validate(req.headers["authorization"]);
        if (result.isErr()) {
            if (
                result.error === TokenValidationErrorCode.MISSING_AUTH_HEADER ||
                result.error === TokenValidationErrorCode.INVALID_AUTH_HEADER ||
                result.error === TokenValidationErrorCode.INVALID_TOKEN
            ) {
                res.status(401).json();
            } else if (result.error === TokenValidationErrorCode.TOKEN_LOOKUP_FAILED || result.error === TokenValidationErrorCode.TOKEN_CREATION_FAILED) {
                res.status(500).json();
            } else {
                throw new Error(`No handler for TokenValidationErrorCode of value ${result.error}.`)
            }

            return;
        }

        const jwt = result.value;
        req.headers[CLIENT_ID_HEADER_KEY] = jwt.userId;
        next();
    }

    const { tokenValidationService } = props;

    return validateTokenMiddleware;
}
