import { Result } from "neverthrow";
import User from "../../../domain/models/User"
import ICurrentUserRequestDTO from "../../../infrastructure/contracts/auth/currentUser/ICurrentUserRequestDTO"
import IPresentationError from "../IPresentationError";

export interface IRegisterUserContract {
    username: string;
    email: string;
    password: string;
}

export interface ILoginUserContract {
    username: string;
    password: string;
}

interface IAuthService {
    user: User | null;
    currentUser(request: ICurrentUserRequestDTO): Promise<User | null>;
    register(request: IRegisterUserContract): Promise<Result<boolean, IPresentationError<object>>>;
    login(request: ILoginUserContract): Promise<Result<boolean, IPresentationError<object>>>;
}

export default IAuthService;