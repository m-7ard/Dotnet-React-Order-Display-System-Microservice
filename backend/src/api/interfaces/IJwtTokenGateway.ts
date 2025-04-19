import { CreateTokenCommand, CreateTokenCommandResult } from "application/handlers/auth/CreateTokenCommandHandler";
import { ReadCachedTokenQuery, ReadCachedTokenQueryResult } from "application/handlers/auth/ReadCachedTokenQueryHandler";
import { ReadRemoteTokenQuery, ReadRemoteTokenQueryResult } from "application/handlers/auth/ReadRemoteTokenQueryHandler";

interface IJwtTokenGateway {
    readCached(query: ReadCachedTokenQuery): Promise<ReadCachedTokenQueryResult>;
    readRemote(query: ReadRemoteTokenQuery): Promise<ReadRemoteTokenQueryResult>;
    create(command: CreateTokenCommand): Promise<CreateTokenCommandResult>;
}

export default IJwtTokenGateway;