import ICurrentUserRequestDTO from "../../../infrastructure/contracts/auth/currentUser/ICurrentUserRequestDTO"
import ILoginUserRequestDTO from "../../../infrastructure/contracts/auth/login/ILoginUserRequestDTO"
import IRegisterUserRequestDTO from "../../../infrastructure/contracts/auth/register/IRegisterUserRequestDTO"

interface IUserDataAccess {
    register(request: IRegisterUserRequestDTO): Promise<Response>
    login(request: ILoginUserRequestDTO): Promise<Response>
    currentUser(request: ICurrentUserRequestDTO): Promise<Response>;
}

export default IUserDataAccess;