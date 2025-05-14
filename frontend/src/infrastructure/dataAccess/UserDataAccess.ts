import { TokenStorage } from "../../presentation/deps/tokenStorage";
import IUserDataAccess from "../../presentation/interfaces/dataAccess/IUserDataAccess";
import { getAuthUrl, getLogoutUrl, getRegisterUrl } from "../../viteUtils";
import ILoginUserRequestDTO from "../contracts/auth/login/ILoginUserRequestDTO";
import ILogoutUserRequestDTO from "../contracts/auth/logout/ILogoutUserRequestDTO";
import IRefreshRequestDTO from "../contracts/auth/refresh/IRefreshRequestDTO";
import IRegisterUserRequestDTO from "../contracts/auth/register/IRegisterUserRequestDTO";

export default class UserDataAccess implements IUserDataAccess {
    private readonly authRoute = `${getAuthUrl()}`;
    private readonly logoutUrl = `${getLogoutUrl()}`;
    private readonly registerUrl = `${getRegisterUrl()}`;
    
    constructor(private readonly tokenStorage: TokenStorage) {
    }

    async register(request: IRegisterUserRequestDTO): Promise<Response> {
        const response = await fetch(`${this.registerUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request)
        });

        return response;
    }
    async login(request: ILoginUserRequestDTO): Promise<Response> {
        const response = await fetch(`${this.authRoute}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request)
        });

        return response;
    }

    async currentUser(): Promise<Response> {
        const response = await fetch(`${this.authRoute}/current-user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.tokenStorage.getAccessToken()}`
            },
        });

        return response;
    }

    async logout(): Promise<Response> {
        const request: ILogoutUserRequestDTO = {
            refreshToken: this.tokenStorage.getRefreshToken(),
            bearerToken: this.tokenStorage.getAccessToken()
        } 

        // Logout through the proxy
        const response = await fetch(`${this.logoutUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });

        return response;
    }

    async refresh(): Promise<Response> {
        const body: IRefreshRequestDTO = {
            refresh: this.tokenStorage.getRefreshToken()
        }

        const response = await fetch(`${this.authRoute}/token/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.tokenStorage.getAccessToken()}`
            },
            body: JSON.stringify(body)
        });

        return response;
    }
}