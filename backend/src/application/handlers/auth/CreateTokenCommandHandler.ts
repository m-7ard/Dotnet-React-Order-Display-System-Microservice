import ITokenRepository from "application/interfaces/ITokenRepository";
import { err, ok } from "neverthrow";
import ICommand, { ICommandResult } from "../ICommand";
import ApplicationError from "application/errors/ApplicationError";
import { IRequestHandler } from "../IRequestHandler";
import JwtToken from "domain/entities/JwtToken";
import CannotCreateJwtToken from "application/errors/jwtToken/CannotCreateJwtToken";


export type CreateTokenCommandResult = ICommandResult<ApplicationError[]>;

export class CreateTokenCommand implements ICommand<CreateTokenCommandResult> {
    __returnType: CreateTokenCommandResult = null!;

    constructor(props: { 
        bearerToken: string;
        expiryDate: Date,
        userId: string
    }) {
        this.bearerToken = props.bearerToken;
        this.expiryDate = props.expiryDate;
        this.userId = props.userId;
    }

    public bearerToken: string;
    public expiryDate: Date;
    public userId: string;
}

export default class CreateTokenCommandHandler implements IRequestHandler<CreateTokenCommand, CreateTokenCommandResult> {
    constructor(private readonly tokenRepository :ITokenRepository) {}
    
    async handle(command: CreateTokenCommand): Promise<CreateTokenCommandResult> {
        const contract = { expiryDate: command.expiryDate, value: command.bearerToken, userId: command.userId };
        const canCreate = JwtToken.canCreate(contract)
        if (canCreate.isErr()) {
            return err(new CannotCreateJwtToken({ message: canCreate.error }).asList());
        }

        const tokenDomain = JwtToken.executeCreate(contract);
        await this.tokenRepository.create(tokenDomain);
        return ok(undefined);
    }
}