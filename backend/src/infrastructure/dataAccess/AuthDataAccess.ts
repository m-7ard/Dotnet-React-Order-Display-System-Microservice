import IAuthDataAccess from "infrastructure/interfaces/IAuthDataAccess";

class AuthDataAccess implements IAuthDataAccess {
    authUrl: string;

    constructor() {
        const authUrl = process.env.AUTH_URL;
        if (authUrl == null) {
            throw new Error("Auth Url was not configured.");
        }

        this.authUrl = authUrl;
    }

    async validateToken(value: string): Promise<Response> {
        return await fetch(`${this.authUrl}/validate-token`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${value}`,
            },
        });
    }

    logout(token: string): Promise<Response> {
        throw new Error("Method not implemented.");
    }
}

export default AuthDataAccess;
