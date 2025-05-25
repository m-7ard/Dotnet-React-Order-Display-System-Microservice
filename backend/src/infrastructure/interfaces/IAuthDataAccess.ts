import ILogoutUserRequestDTO from "infrastructure/contracts/auth/logout/ILogoutUserRequestDTO";
import IRegisterUserRequestDTO from "infrastructure/contracts/auth/register/IRegisterUserRequestDTO";

interface IAuthDataAccess {
    validateToken(value: string): Promise<Response>;
    logout(accessToken: string, contract: ILogoutUserRequestDTO): Promise<Response>;
    register(contract: IRegisterUserRequestDTO): Promise<Response>;
}

export default IAuthDataAccess;
