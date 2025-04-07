import { PropsWithChildren, useCallback, useState } from "react";
import { AuthServiceContext } from "./Application.AuthServiceProvider.Context";
import { useDataAccessContext } from "./Application.DataAccessProvider.Context";
import User from "../../domain/models/User";
import IAuthService from "../interfaces/services/IAuthService";
import ICurrentUserResponseDTO from "../../infrastructure/contracts/auth/currentUser/ICurrentUserResponseDTO";
import userMapper from "../../infrastructure/mappers/userMapper";
import useResponseHandler, { useFluentResponseHandler } from "../hooks/useResponseHandler";
import { err, ok } from "neverthrow";

export default function AuthServiceProvider(props: PropsWithChildren) {
    // Props
    const { children } = props;

    // Deps
    const { userDataAccess } = useDataAccessContext();
    const fluentResponseHandler = useFluentResponseHandler();

    // State
    const [user, setUser] = useState<User | null>(null);

    const currentUser = useCallback<IAuthService["currentUser"]>(async () => {
        return fluentResponseHandler<User, null>()
            .withRequest(async () => userDataAccess.currentUser({}))
            .onResponse(async (response) => {
                if (response.ok) {
                    const data: ICurrentUserResponseDTO = await response.json();
                    const user = userMapper.apiToDomain(data);
                    setUser(user);
                    return ok(user);
                }

                return err(null);
            })
            .withFallback(null)
            .execute();
    }, [fluentResponseHandler, userDataAccess]);

    

    return (
        <AuthServiceContext.Provider
            value={{
                user: user,
                currentUser: currentUser,
                register: register,
                login: login
            }}
        >
            {children}
        </AuthServiceContext.Provider>
    );
}
