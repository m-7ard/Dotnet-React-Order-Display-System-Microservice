import { PropsWithChildren } from "react";
import { TAnyGenericRoute, ICommonRouteMapping, TExtractGenericRouteLoaderData, TExtractGenericRouteParams } from "../routeTypes";
import { RouterModuleContext } from "./RouterModule.Context";

export interface IRouterModule {
    genericRoutes: ICommonRouteMapping;
    useRouterLoaderData: <T extends TAnyGenericRoute>(exp: (keys: ICommonRouteMapping) => T) => TExtractGenericRouteLoaderData<T>;
    useRouterLocationEq: () => <T extends TAnyGenericRoute>(exp: (keys: ICommonRouteMapping) => T) => boolean;
    useRouterNavigate: () => <T extends TAnyGenericRoute>(props: {
        exp: (keys: ICommonRouteMapping) => T;
        params: TExtractGenericRouteParams<T>;
        search?: Record<string, string>;
    }) => void;
    useRouterHref: () => string;
}

export default function RouterModule({ children, ...routerModule }: PropsWithChildren<IRouterModule>) {
    return <RouterModuleContext.Provider value={routerModule}>{children}</RouterModuleContext.Provider>;
}
