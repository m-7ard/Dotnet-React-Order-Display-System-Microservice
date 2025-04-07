import User from "../../../domain/models/User"
import ICurrentUserRequestDTO from "../../../infrastructure/contracts/auth/currentUser/ICurrentUserRequestDTO"
import ILoginUserRequestDTO from "../../../infrastructure/contracts/auth/login/ILoginUserRequestDTO"

export interface IRegisterUserContract {
    username: string;
    email: string;
    password: string;
}

interface IAuthService {
    user: User | null;
    register(request: IRegisterUserContract): Promise<void>
    login(request: ILoginUserRequestDTO): Promise<void>
    currentUser(request: ICurrentUserRequestDTO): Promise<User | null>;
}

export default IAuthService;