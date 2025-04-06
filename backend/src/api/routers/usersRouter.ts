import { Request, Response, Router } from "express";
import registerAction from "../utils/registerAction";
import { DI_TOKENS, IDIContainer } from "api/services/DIContainer";
import RegisterUserAction from "api/actions/users/RegisterUserAction";
import LoginUserAction from "api/actions/users/LoginUserAction";
import ExpressHttpService from "api/services/ExpressHttpService";
import CurrentUserAction from "api/actions/users/CurrentUserAction";

export function createUsersRouter(diContainer: IDIContainer) {
    const usersRouter = Router();

    registerAction({
        router: usersRouter,
        path: "/register",
        method: "POST",
        initialiseAction: () => {
            const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
            return new RegisterUserAction(requestDispatcher);
        },
    });

    registerAction({
        router: usersRouter,
        path: "/login",
        method: "POST",
        initialiseAction: (req: Request, res: Response) => {
            const httpService = new ExpressHttpService(req, res);
            const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
            return new LoginUserAction(requestDispatcher, httpService);
        },
    });

    registerAction({
        router: usersRouter,
        path: "/current",
        method: "GET",
        initialiseAction: (req: Request, res: Response) => {
            const httpService = new ExpressHttpService(req, res);
            const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
            return new CurrentUserAction(requestDispatcher, httpService);
        },
    });

    return usersRouter;
}
