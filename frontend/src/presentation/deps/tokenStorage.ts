export class TokenStorage {
    private accessToken: string | null = null;
    // private refreshToken: string | null = null;

    constructor() {}

    setAccessToken(value: string | null) {
        this.accessToken = value;
    }

    getAccessToken(): string {
        return this.accessToken ?? "";
    }
}

const tokenStorage = new TokenStorage();
export default tokenStorage;