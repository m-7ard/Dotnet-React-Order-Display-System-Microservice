import ILogoutUserRequestDTO from "infrastructure/contracts/auth/logout/ILogoutUserRequestDTO";
import IAuthDataAccess from "infrastructure/interfaces/IAuthDataAccess";

class AuthDataAccess implements IAuthDataAccess {
    constructor(private readonly authUrl: string) {}

    async validateToken(value: string): Promise<Response> {
        return await fetch(`${this.authUrl}/validate-token`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${value}`,
            },
        });
    }

    async logout(accessToken: string, contract: ILogoutUserRequestDTO): Promise<Response> {
        return await fetch(`${this.authUrl}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(contract),
        });
    }
}

export default AuthDataAccess;
