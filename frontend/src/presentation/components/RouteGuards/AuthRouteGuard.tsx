import { PropsWithChildren, useEffect, useRef } from "react";
import { useAuthServiceContext } from "../../Application/Application.AuthServiceProvider.Context";
import { useRouterModuleContext } from "../../routes/RouterModule/RouterModule.Context";

function AuthRouteGuard(props: PropsWithChildren) {
    // Deps
    const { user } = useAuthServiceContext();
    const { useRouterNavigate } = useRouterModuleContext();
    const navigate = useRouterNavigate();
    const redirected = useRef(false);
    console.log("user: ", user);

    // Effect
    useEffect(() => {
        if (redirected.current) {
            return;
        }

        if (user == null) {
            navigate({ exp: (routes) => routes.LOGIN_USER, params: {} });
            redirected.current = true;
        }
    }, [navigate, user, redirected]);

    if (user == null) {
        return null;
    }

    return props.children;
}

export default AuthRouteGuard;
