import ILogoutUserRequestDTO from "infrastructure/contracts/auth/logout/ILogoutUserRequestDTO";

interface IAuthDataAccess {
    validateToken(value: string): Promise<Response>;
    logout(accessToken: string, contract: ILogoutUserRequestDTO): Promise<Response>;
}

export default IAuthDataAccess;
