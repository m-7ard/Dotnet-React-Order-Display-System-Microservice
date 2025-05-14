import ITokenRepository from "application/interfaces/ITokenRepository";
import IAuthDataAccess from "infrastructure/interfaces/IAuthDataAccess";
import { err, ok } from "neverthrow";
import ICommand, { ICommandResult } from "../ICommand";
import ApplicationError from "application/errors/ApplicationError";
import { IRequestHandler } from "../IRequestHandler";
import UnexpectedRegisterUserFailedError from "application/errors/auth/register/UnexpectedRegisterUserFailedError";
import RegularRegisterUserFailedError from "application/errors/auth/register/RegularRegisterUserFailedError";
import QueueService from "infrastructure/services/QueueService";
import IRegisterUserResponseDTO from "infrastructure/contracts/auth/register/IRegisterUserResponseDTO";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IDjangoErrors from "application/errors/IDjangoError";

export type RegisterUserCommandResult = ICommandResult<ApplicationError[]>;

export class RegisterUserCommand implements ICommand<RegisterUserCommandResult> {
    readonly __returnType: RegisterUserCommandResult = null!;

    constructor(props: { 
        username: string;
        email: string;
        password: string;
    }) {
        this.username = props.username;
        this.email = props.email;
        this.password = props.password;
    }

    public username: string;
    public email: string;
    public password: string;
}

export default class RegisterUserCommandHandler implements IRequestHandler<RegisterUserCommand, RegisterUserCommandResult> {
    constructor(private readonly authDataAccess: IAuthDataAccess, private readonly queueService: QueueService) {}
    
    async handle(command: RegisterUserCommand): Promise<RegisterUserCommandResult> {
        const response = await this.authDataAccess.register({ email: command.email, password: command.password, username: command.username });
        if (response.status >= 400 && response.status < 500) {
            const errors: IDjangoErrors = await response.json();
            const apiErorrs = ApplicationErrorFactory.djangoErrorsToApiErrors(errors);
            return err(apiErorrs.map((error) => new RegularRegisterUserFailedError({ message: error.message, path: error.path })));
        }

        if (!response.ok) {
            return err(new UnexpectedRegisterUserFailedError({ message: `Something went wrong while trying to register the user.` }).asList());
        }

        const data: IRegisterUserResponseDTO = await response.json();
        console.log(data)
        this.queueService.ensureApplicationReady(data.pk.toString());

        return ok(undefined);
    }
}