import { useCallback, useEffect, useRef, useState } from "react";
import { AuthServiceContext } from "./Application.AuthServiceProvider.Context";
import User from "../../domain/models/User";
import IAuthService from "../interfaces/services/IAuthService";
import ICurrentUserResponseDTO from "../../infrastructure/contracts/auth/currentUser/ICurrentUserResponseDTO";
import userMapper from "../../infrastructure/mappers/userMapper";
import { useFluentResponseHandler } from "../hooks/useResponseHandler";
import { err, ok } from "neverthrow";
import { useApplicationExceptionContext } from "./Application.ExceptionProvider.Context";
import tryHandleRequest from "../utils/routableErrors/tryHandleRequest";
import PresentationErrorFactory from "../mappers/PresentationErrorFactory";
import IDjangoErrors from "../../infrastructure/interfaces/IDjangoError";
import ILoginUserResponseDTO from "../../infrastructure/contracts/auth/login/ILoginUserResponseDTO";
import IPlainApiError from "../../infrastructure/interfaces/IPlainApiError";
import IRefreshResponseDTO from "../../infrastructure/contracts/auth/refresh/IRefreshResponseDTO";
import IUserDataAccess from "../interfaces/dataAccess/IUserDataAccess";
import { TokenStorage } from "../deps/tokenStorage";
import WebsocketProducerService from "../../infrastructure/websocket/services/WebsocketProducerService";

export default function AuthServiceProvider(props: React.PropsWithChildren<{ href: string; userDataAccess: IUserDataAccess; tokenStorage: TokenStorage; websocketProducerService: WebsocketProducerService }>) {
    // Props
    const { children, href, userDataAccess, tokenStorage, websocketProducerService } = props;

    // Deps
    const fluentResponseHandler = useFluentResponseHandler();
    const { dispatchException } = useApplicationExceptionContext();

    // State
    const currentHref = useRef(href);
    const [user, setUser] = useState<User | null>(null);
    const [hasInitialised, setHasInitialised] = useState(false);

    const currentUser = useCallback<IAuthService["currentUser"]>(async () => {
        return fluentResponseHandler<User | null, null>()
            .withRequest(async () => userDataAccess.currentUser({}))
            .onResponse(async (response) => {
                if (response.ok) {
                    const data: ICurrentUserResponseDTO = await response.json();
                    const user = userMapper.apiToDomain(data);
                    setUser(user);
                    return ok(user);
                }

                setUser(null);
                if (response.status >= 400 && response.status <= 499) {
                    return ok(null);
                }

                return err(null);
            })
            .withFallback(null)
            .execute();
    }, [fluentResponseHandler, userDataAccess]);

    const register = useCallback<IAuthService["register"]>(
        async (params) => {
            tokenStorage.setAccessToken(null);
            tokenStorage.setRefreshToken(null);

            try {
                const result = await tryHandleRequest(userDataAccess.register({ email: params.email, password: params.password, username: params.username }));

                if (result.isErr()) {
                    dispatchException(result.error);
                    return err({ _: [result.error.message] });
                }

                const response = result.value;
                if (response.ok) {
                    return ok(true);
                }

                const errors: IPlainApiError[] = await response.json();
                return err(PresentationErrorFactory.ApiErrorsToPresentationErrors(errors));
            } catch (error: unknown) {
                dispatchException(error);
                return err({ _: [JSON.stringify(error)] });
            }
        },
        [dispatchException, userDataAccess, tokenStorage],
    );

    const login = useCallback<IAuthService["login"]>(
        async (params) => {
            try {
                const result = await tryHandleRequest(userDataAccess.login({ password: params.password, username: params.username }));

                if (result.isErr()) {
                    dispatchException(result.error);
                    return err({ _: [result.error.message] });
                }

                const response = result.value;
                if (response.ok) {
                    const data: ILoginUserResponseDTO = await response.json();
                    tokenStorage.setAccessToken(data.access);
                    tokenStorage.setRefreshToken(data.refresh);
                    await currentUser({});
                    websocketProducerService.authenticateUser(tokenStorage.getAccessToken());
                    return ok(true);
                }

                const errors: IDjangoErrors = await response.json();
                return err(PresentationErrorFactory.DjangoErrorsToPresentationErrors(errors));
            } catch (error: unknown) {
                dispatchException(error);
                return err({ _: [JSON.stringify(error)] });
            }
        },
        [dispatchException, userDataAccess, currentUser, tokenStorage, websocketProducerService],
    );

    const logout = useCallback<IAuthService["logout"]>(async () => {
        try {
            const result = await tryHandleRequest(userDataAccess.logout());

            if (result.isErr()) {
                dispatchException(result.error);
                return;
            }

            const response = result.value;
            if (response.ok || response.status === 401 || response.status === 400) {
                await currentUser({});
                return;
            }

            const errors: IPlainApiError[] = await response.json();
            dispatchException(JSON.stringify(errors));
        } catch (error: unknown) {
            dispatchException(error);
        } finally {
            tokenStorage.setAccessToken(null);
            tokenStorage.setRefreshToken(null);
        }
    }, [dispatchException, userDataAccess, currentUser, tokenStorage]);

    // On Navigation
    useEffect(() => {
        if (hasInitialised && currentHref.current === href) {
            return;
        }

        currentUser({})
            .then(() => {
                setHasInitialised(true);
            })
            .catch(() => {
                setHasInitialised(true);
            });
        currentHref.current = href;

        websocketProducerService.authenticateUser(tokenStorage.getAccessToken());
    }, [currentUser, dispatchException, href, hasInitialised, websocketProducerService, tokenStorage]);

    // Refresh token
    useEffect(() => {
        if (user == null) {
            return;
        }

        const fn = setInterval(() => {
            userDataAccess
                .refresh()
                .then((response) => {
                    if (response.ok) {
                        return response.json() as Promise<IRefreshResponseDTO>;
                    }

                    throw response.json();
                })
                .then((body) => {
                    tokenStorage.setAccessToken(body.access);
                    websocketProducerService.authenticateUser(tokenStorage.getAccessToken());
                })
                .catch(() => clearInterval(fn));
        }, 1000 * 60 * 29);

        return () => {
            clearInterval(fn);
        };
    }, [user, tokenStorage, userDataAccess, websocketProducerService]);

    // Service
    const authService: IAuthService = {
        user: user,
        currentUser: currentUser,
        register: register,
        login: login,
        logout: logout,
    };

    return hasInitialised && <AuthServiceContext.Provider value={authService}>{children}</AuthServiceContext.Provider>;
}
