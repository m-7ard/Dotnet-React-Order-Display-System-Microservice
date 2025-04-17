export class TokenStorage {
    private accessToken: string | null = null;
    private refreshToken: string | null = null;

    constructor() {
        this.setAccessToken(localStorage.getItem("accessToken"));
        this.setRefreshToken(localStorage.getItem("refreshToken"));
    }

    setAccessToken(value: string | null) {
        this.accessToken = value;

        if (value != null) {
            localStorage.setItem("accessToken", value);
        } else {
            localStorage.removeItem("accessToken");
        }
    }

    setRefreshToken(value: string | null) {
        this.refreshToken = value;

        if (value != null) {
            localStorage.setItem("refreshToken", value);
        } else {
            localStorage.removeItem("refreshToken");
        }
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
