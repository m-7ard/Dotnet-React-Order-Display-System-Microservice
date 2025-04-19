import IJwtTokenGateway from "api/interfaces/IJwtTokenGateway";
import CreateTokenCommandHandler, { CreateTokenCommand, CreateTokenCommandResult } from "application/handlers/auth/CreateTokenCommandHandler";
import ReadCachedTokenQueryHandler, { ReadCachedTokenQuery, ReadCachedTokenQueryResult } from "application/handlers/auth/ReadCachedTokenQueryHandler";
import ReadRemoteTokenQueryHandler, { ReadRemoteTokenQuery, ReadRemoteTokenQueryResult } from "application/handlers/auth/ReadRemoteTokenQueryHandler";
import ITokenRepository from "application/interfaces/ITokenRepository";
import IAuthDataAccess from "infrastructure/interfaces/IAuthDataAccess";

class JwtTokenGateway implements IJwtTokenGateway {
    constructor(private readonly tokenRepository: ITokenRepository, private readonly authDataAccess: IAuthDataAccess) {}

    async readCached(query: ReadCachedTokenQuery): Promise<ReadCachedTokenQueryResult> {
        const handler = new ReadCachedTokenQueryHandler(this.tokenRepository);
        return await handler.handle(query);
    }

    async readRemote(query: ReadRemoteTokenQuery): Promise<ReadRemoteTokenQueryResult> {
        const handler = new ReadRemoteTokenQueryHandler(this.authDataAccess);
        return await handler.handle(query);
    }

    async create(command: CreateTokenCommand): Promise<CreateTokenCommandResult> {
        const handler = new CreateTokenCommandHandler(this.tokenRepository);
        return await handler.handle(command);
    }
}

export default JwtTokenGateway;