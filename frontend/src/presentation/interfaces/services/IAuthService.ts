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
    currentUser(contract: ICurrentUserRequestDTO): Promise<User | null>;
    register(contract: IRegisterUserContract): Promise<Result<boolean, IPresentationError<object>>>;
    login(contract: ILoginUserContract): Promise<Result<boolean, IPresentationError<object>>>;
    logout(): Promise<void>;
}

export default IAuthService;