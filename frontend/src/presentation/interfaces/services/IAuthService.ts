import { Result } from "neverthrow";
import User from "../../../domain/models/User"
import ICurrentUserRequestDTO from "../../../infrastructure/contracts/auth/currentUser/ICurrentUserRequestDTO"
import ILoginUserRequestDTO from "../../../infrastructure/contracts/auth/login/ILoginUserRequestDTO"
import IPlainApiError from "../../../infrastructure/interfaces/IPlainApiError";

export interface IRegisterUserContract {
    username: string;
    email: string;
    password: string;
}

interface IAuthService {
    user: User | null;
    currentUser(request: ICurrentUserRequestDTO): Promise<User | null>;
}

export default IAuthService;