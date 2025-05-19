import IJwtTokenGateway from "api/interfaces/IJwtTokenGateway";
import { CreateTokenCommand } from "application/handlers/auth/CreateTokenCommandHandler";
import { ReadCachedTokenQuery } from "application/handlers/auth/ReadCachedTokenQueryHandler";
import { ReadRemoteTokenQuery } from "application/handlers/auth/ReadRemoteTokenQueryHandler";
import JwtToken from "domain/entities/JwtToken";
import { Result, err, ok } from "neverthrow";

export enum TokenValidationErrorCode {
    MISSING_AUTH_HEADER = "MISSING_AUTH_HEADER",
    INVALID_AUTH_HEADER = "INVALID_AUTH_HEADER",
    INVALID_TOKEN = "INVALID_TOKEN",
    TOKEN_LOOKUP_FAILED = "TOKEN_LOOKUP_FAILED",
    TOKEN_CREATION_FAILED = "TOKEN_CREATION_FAILED"
}

export type TokenValidationResult = Result<JwtToken, TokenValidationErrorCode>;

export class TokenValidationService {
    constructor(
        private gateway: IJwtTokenGateway
    ) {}

    async validateToken(token: string): Promise<TokenValidationResult> {
        // Find cached token
        const queryResult = await this.gateway.readCached(new ReadCachedTokenQuery({ bearerToken: token }));
        if (queryResult.isErr()) {
            return err(TokenValidationErrorCode.TOKEN_LOOKUP_FAILED);
        }

        if (queryResult.isOk() && queryResult.value != null) {
            return ok(queryResult.value);
        }

        // Find remote token
        const remoteResult = await this.gateway.readRemote(new ReadRemoteTokenQuery({ bearerToken: token }))
        if (remoteResult.isErr()) {
            return err(TokenValidationErrorCode.TOKEN_LOOKUP_FAILED);
        }

        if (remoteResult.value == null) {
            return err(TokenValidationErrorCode.INVALID_TOKEN);
        }

        const jwtToken = remoteResult.value;

        // Create new token
        const createResult = await this.gateway.create(new CreateTokenCommand({ bearerToken: jwtToken.value, expiryDate: jwtToken.expiryDate, userId: jwtToken.userId }));
        if (createResult.isErr()) {
            return err(TokenValidationErrorCode.TOKEN_CREATION_FAILED);
        }

        return ok(jwtToken);
    }

    async validateHeader(authHeader: string | undefined): Promise<TokenValidationResult> {
        if (authHeader == null) {
            return err(TokenValidationErrorCode.MISSING_AUTH_HEADER);
        }

        const [_, token] = authHeader.split(" ");
        if (token == null) {
            return err(TokenValidationErrorCode.INVALID_AUTH_HEADER);
        }

       return await this.validateToken(token);
    }
}
