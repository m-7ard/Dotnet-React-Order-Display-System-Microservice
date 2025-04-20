import ITokenRepository from "application/interfaces/ITokenRepository";
import IAuthDataAccess from "infrastructure/interfaces/IAuthDataAccess";
import { ok } from "neverthrow";
import ApplicationError from "application/errors/ApplicationError";
import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import JwtToken from "domain/entities/JwtToken";


export type ReadCachedTokenQueryResult = IQueryResult<JwtToken | null, ApplicationError[]>;

export class ReadCachedTokenQuery implements IQuery<ReadCachedTokenQueryResult> {
    __returnType: ReadCachedTokenQueryResult = null!;

    constructor(props: { 
        bearerToken: string;
    }) {
        this.bearerToken = props.bearerToken;
    }

    public bearerToken: string;
}

export default class ReadCachedTokenQueryHandler implements IRequestHandler<ReadCachedTokenQuery, ReadCachedTokenQueryResult> {
    constructor(private readonly tokenRepository: ITokenRepository) {}
    
    async handle(command: ReadCachedTokenQuery): Promise<ReadCachedTokenQueryResult> {
        const token = await this.tokenRepository.getToken(command.bearerToken);
        if (token != null && token.isValid()) {
            return ok(token)
        }

        return ok(null);
    }
}