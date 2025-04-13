export class TokenStorage {
    private accessToken: string | null = null;
    private refreshToken: string | null = null;

    constructor() {}

    setAccessToken(value: string | null) {
        this.accessToken = value;
    }

    setRefreshToken(value: string | null) {
        this.refreshToken = value;
    }

    getAccessToken(): string {
        return this.accessToken ?? "";
    }

    getRefreshToken(): string {
        return this.refreshToken ?? "";
    }
}

const tokenStorage = new TokenStorage();
export default tokenStorage;