import ITokenRepository from "application/interfaces/ITokenRepository";
import IAuthDataAccess from "infrastructure/interfaces/IAuthDataAccess";
import { err, ok } from "neverthrow";
import ICommand, { ICommandResult } from "../ICommand";
import ApplicationError from "application/errors/ApplicationError";
import { IRequestHandler } from "../IRequestHandler";
import RegularUserLogoutFailedError from "application/errors/auth/logout/RegularUserLogoutFailedError";
import UnexpectedUserLogoutFailedError from "application/errors/auth/logout/UnexpectedUserLogoutFailedError";


export type LogoutUserCommandResult = ICommandResult<ApplicationError[]>;

export class LogoutUserCommand implements ICommand<LogoutUserCommandResult> {
    readonly __returnType: LogoutUserCommandResult = null!;

    constructor(props: { 
        refreshToken: string;
        bearerToken: string;
    }) {
        this.refreshToken = props.refreshToken;
        this.bearerToken = props.bearerToken;
    }

    public refreshToken: string;
    public bearerToken: string;
}

export default class LogoutUserCommandHandler implements IRequestHandler<LogoutUserCommand, LogoutUserCommandResult> {
    constructor(private readonly authDataAccess: IAuthDataAccess, private readonly tokenRepository: ITokenRepository) {}
    
    async handle(command: LogoutUserCommand): Promise<LogoutUserCommandResult> {
        const response = await this.authDataAccess.logout(command.bearerToken, { refresh: command.refreshToken });
        if (response.status >= 400 && response.status < 500) {
            return err(new RegularUserLogoutFailedError({ message: `Failed to logout user. Auth server returned a "${response.status}" status code.` }).asList());
        }

        if (!response.ok) {
            return err(new UnexpectedUserLogoutFailedError({ message: `Failed to logout user. Auth server returned a "${response.status}" status code.` }).asList());
        }

        const token = await this.tokenRepository.getToken(command.bearerToken);
        if (token != null) {
            await this.tokenRepository.expireToken(token);            
        }

        return ok(undefined);
    }
}