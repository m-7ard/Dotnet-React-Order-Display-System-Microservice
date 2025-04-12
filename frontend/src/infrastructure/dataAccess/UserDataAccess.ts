import { TokenStorage } from "../../presentation/deps/tokenStorage";
import IUserDataAccess from "../../presentation/interfaces/dataAccess/IUserDataAccess";
import { getAuthUrl } from "../../viteUtils";
import ILoginUserRequestDTO from "../contracts/auth/login/ILoginUserRequestDTO";
import IRegisterUserRequestDTO from "../contracts/auth/register/IRegisterUserRequestDTO";

export default class UserDataAccess implements IUserDataAccess {
    private readonly authRoute = `${getAuthUrl()}`;
    
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
        console.log("req: ", request)
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
}