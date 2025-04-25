import IAuthDataAccess from "infrastructure/interfaces/IAuthDataAccess";
import { err, ok } from "neverthrow";
import ApplicationError from "application/errors/ApplicationError";
import { IRequestHandler } from "../IRequestHandler";
import ValidateTokenResponseDTO from "infrastructure/contracts/auth/validateToken/ValidateTokenResponseDTO";
import JwtToken from "domain/entities/JwtToken";
import CannotValidateTokenError from "application/errors/auth/validateToken/CannotValidateTokenError";
import IQuery, { IQueryResult } from "../IQuery";


export type ReadRemoteTokenQueryResult = IQueryResult<JwtToken | null, ApplicationError[]>;

export class ReadRemoteTokenQuery implements IQuery<ReadRemoteTokenQueryResult> {
    __returnType: ReadRemoteTokenQueryResult = null!;

    constructor(props: { 
        bearerToken: string;
    }) {
        this.bearerToken = props.bearerToken;
    }

    public bearerToken: string;
}

export default class ReadRemoteTokenQueryHandler implements IRequestHandler<ReadRemoteTokenQuery, ReadRemoteTokenQueryResult> {
    constructor(private readonly authDataAccess: IAuthDataAccess) {}
    
    async handle(command: ReadRemoteTokenQuery): Promise<ReadRemoteTokenQueryResult> {
        const response = await this.authDataAccess.validateToken(command.bearerToken);
    
        if (response.ok) {
            const data: ValidateTokenResponseDTO = await response.json();
            const tokenDomain = JwtToken.executeCreate({ expiryDate: new Date(data.expiration), value: command.bearerToken, userId: data.user_id.toString() });
            return ok(tokenDomain);
        } 

        if (response.status >= 400 && response.status < 500) {
            return ok(null);
        }
    
        return err(new CannotValidateTokenError({ message: `Unable to validate the token.` }).asList());
    }
}