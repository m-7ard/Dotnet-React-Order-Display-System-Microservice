import IAction from "../IAction";
import ILogoutUserResponseDTO from "infrastructure/contracts/auth/logout/ILogoutUserResponseDTO";
import { Request } from "express";
import JsonResponse from "api/responses/JsonResponse";
import IApiError from "api/errors/IApiError";
import ILogoutUserRequestDTO from "api/contracts/logout/ILogoutUserRequestDTO";
import LogoutUserCommandHandler, { LogoutUserCommand } from "application/handlers/auth/LogoutUserCommandHandler";
import RegularUserLogoutFailedError from "application/errors/auth/logout/RegularUserLogoutFailedError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";

type ActionRequest = { dto: ILogoutUserRequestDTO };
type ActionResponse = JsonResponse<ILogoutUserResponseDTO | IApiError[]>;

class LogoutAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly logoutUserCommandHandler: LogoutUserCommandHandler) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const result = await this.logoutUserCommandHandler.handle(new LogoutUserCommand({ refreshToken: request.dto.refreshToken, bearerToken: request.dto.bearerToken }));
        if (result.isErr()) {
            const [firstError] = result.error;
            if (firstError instanceof RegularUserLogoutFailedError) {
                return new JsonResponse({
                    status: 400,
                    body: ApiErrorFactory.mapApplicationErrors(result.error)
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
                bearerToken: request.body.bearerToken,
                refreshToken: request.body.refreshToken
            }
        }
    }
}

export default LogoutAction;