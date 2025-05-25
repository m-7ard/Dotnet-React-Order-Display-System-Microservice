import IAction from "../IAction";
import { Request } from "express";
import JsonResponse from "api/responses/JsonResponse";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IRegisterUserRequestDTO from "api/contracts/register/IRegisterUserRequestDTO";
import IRegisterUserResponseDTO from "api/contracts/register/IRegisterUserResponseDTO";
import RegisterUserCommandHandler, { RegisterUserCommand } from "application/handlers/auth/RegisterUserCommandHandler";
import RegularRegisterUserFailedError from "application/errors/auth/register/RegularRegisterUserFailedError";

type ActionRequest = { dto: IRegisterUserRequestDTO };
type ActionResponse = JsonResponse<IRegisterUserResponseDTO | IApiError[]>;

class RegisterAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly registerUserCommandHandler: RegisterUserCommandHandler) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const result = await this.registerUserCommandHandler.handle(new RegisterUserCommand({ email: request.dto.email, password: request.dto.password, username: request.dto.username }));
        if (result.isErr()) {
            const [firstError] = result.error;
            if (firstError instanceof RegularRegisterUserFailedError) {
                return new JsonResponse({
                    status: 400,
                    body: ApiErrorFactory.mapApplicationErrors(result.error, { [firstError.code]: [] })
                });
            } 

            return new JsonResponse({
                status: 500,
                body: ApiErrorFactory.mapApplicationErrors(result.error)
            }); 
        }

        return new JsonResponse({
            status: 200,
            body: {}
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {
                email: request.body.email,
                password: request.body.password,
                username: request.body.username,
            }
        }
    }
}

export default RegisterAction;