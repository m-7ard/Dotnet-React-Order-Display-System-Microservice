import { useCallback, useEffect, useRef, useState } from "react";
import { AuthServiceContext } from "./Application.AuthServiceProvider.Context";
import { useDataAccessContext } from "./Application.DataAccessProvider.Context";
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

export default function AuthServiceProvider(props: React.PropsWithChildren<{ href: string }>) {
    // Props
    const { children, href } = props;

    // Deps
    const { userDataAccess, tokenStorage } = useDataAccessContext();
    const fluentResponseHandler = useFluentResponseHandler();
    const { dispatchException } = useApplicationExceptionContext();

    // State
    const currentHref = useRef(href);
    const [user, setUser] = useState<User | null>(null);

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

                const errors: IDjangoErrors = await response.json();
                return err(PresentationErrorFactory.DjangoErrorsToPresentationErrors(errors));
            } catch (error: unknown) {
                dispatchException(error);
                return err({ _: [JSON.stringify(error)] });
            }
        },
        [dispatchException, userDataAccess],
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
                    return ok(true);
                }

                const errors: IDjangoErrors = await response.json();
                return err(PresentationErrorFactory.DjangoErrorsToPresentationErrors(errors));
            } catch (error: unknown) {
                dispatchException(error);
                return err({ _: [JSON.stringify(error)] });
            }
        },
        [dispatchException, userDataAccess, currentUser, tokenStorage],
    );

    const logout = useCallback<IAuthService["logout"]>(
        async () => {
            try {
                const result = await tryHandleRequest(userDataAccess.logout());

                if (result.isErr()) {
                    dispatchException(result.error);
                    return;
                }

                const response = result.value;
                if (response.ok) {
                    tokenStorage.setAccessToken(null);
                    tokenStorage.setRefreshToken(null);
                    await currentUser({});
                    return;
                }

                const errors: IPlainApiError[] = await response.json();
                dispatchException(JSON.stringify(errors));
            } catch (error: unknown) {
                dispatchException(error);
            }
        },
        [dispatchException, userDataAccess, currentUser, tokenStorage],
    );

    // On Navigation
    useEffect(() => {
        if (currentHref.current === href) {
            return;
        }

        currentUser({});
        currentHref.current = href;
    }, [currentUser, dispatchException, href]);

    // Service
    const authService: IAuthService = {
        user: user,
        currentUser: currentUser,
        register: register,
        login: login,
        logout: logout
    };

    return <AuthServiceContext.Provider value={authService}>{children}</AuthServiceContext.Provider>;
}
