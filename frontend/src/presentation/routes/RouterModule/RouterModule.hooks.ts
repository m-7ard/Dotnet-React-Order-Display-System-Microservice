import { IRouterModule } from "./RouterModule";
import { useRouterModuleContext } from "./RouterModule.Context";

export function useRouterModule() {
    const routerModule = useRouterModuleContext();
    return routerModule;
}

export const useGenericRoutes: () => IRouterModule["genericRoutes"] = () => {
    const { genericRoutes } = useRouterModuleContext();
    return genericRoutes;
}

export const useRouterLoaderData: IRouterModule["useRouterLoaderData"] = (exp) => {
    const { useRouterLoaderData } = useRouterModuleContext();
    return useRouterLoaderData(exp);
}

export function useRouterLocationEq() {
    const { useRouterLocationEq } = useRouterModuleContext();
    return useRouterLocationEq();
}

export function useRouterNavigate() {
    const { useRouterNavigate } = useRouterModuleContext();
    return useRouterNavigate();
}

export function useRouterCurrentRoute() {
    const { useRouterCurrentRoute } = useRouterModuleContext();
    return useRouterCurrentRoute();
}
