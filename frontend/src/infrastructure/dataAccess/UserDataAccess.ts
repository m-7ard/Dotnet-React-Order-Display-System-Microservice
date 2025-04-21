import { TokenStorage } from "../../presentation/deps/tokenStorage";
import IUserDataAccess from "../../presentation/interfaces/dataAccess/IUserDataAccess";
import { getApiUrl, getAuthUrl } from "../../viteUtils";
import ILoginUserRequestDTO from "../contracts/auth/login/ILoginUserRequestDTO";
import ILogoutUserRequestDTO from "../contracts/auth/logout/ILogoutUserRequestDTO";
import IRegisterUserRequestDTO from "../contracts/auth/register/IRegisterUserRequestDTO";

export default class UserDataAccess implements IUserDataAccess {
    private readonly authRoute = `${getAuthUrl()}`;
    private readonly apiUrl = `${getApiUrl()}`;
    
    constructor(private readonly tokenStorage: TokenStorage) {}

    async register(request: IRegisterUserRequestDTO): Promise<Response> {
        const response = await fetch(`${this.authRoute}/register`, {
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
        console.log(`${this.authRoute}/current-user`)
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

        console.log("login: ", request)

        // Logout through the proxy
        const response = await fetch(`${this.apiUrl}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });

        return response;
    }
}