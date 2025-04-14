import IAction from "../IAction";
import ILogoutUserResponseDTO from "infrastructure/contracts/auth/logout/ILogoutUserResponseDTO";
import { Request } from "express";
import IAuthDataAccess from "infrastructure/interfaces/IAuthDataAccess";
import JsonResponse from "api/responses/JsonResponse";
import IApiError from "api/errors/IApiError";
import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import ILogoutUserRequestDTO from "api/contracts/logout/ILogoutUserRequestDTO";
import ITokenRepository from "api/interfaces/ITokenRepository";

type ActionRequest = { dto: ILogoutUserRequestDTO };
type ActionResponse = JsonResponse<ILogoutUserResponseDTO | IApiError[]>;

class LogoutAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly authDataAccess: IAuthDataAccess, private readonly tokenRepository: ITokenRepository) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const response = await this.authDataAccess.logout(request.dto.bearerToken, { refresh: request.dto.refreshToken });
        if (response.status >= 400 && response.status < 500) {
            return new JsonResponse({
                status: response.status,
                body: await response.json()
            });
        }

        if (!response.ok) {
            const errors: IApiError[] = [{
                code: API_ERROR_CODES.INFRASTRUCTURE_ERROR,
                message: "Something went wrong while trying to log out user.",
                path: "_"
            }];

            return new JsonResponse({
                status: response.status,
                body: errors
            });
        }

        const token = await this.tokenRepository.getToken(request.dto.bearerToken);
        if (token != null) {
            await this.tokenRepository.expireToken(token);            
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