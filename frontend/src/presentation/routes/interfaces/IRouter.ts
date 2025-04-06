import { IRouterModule } from "../RouterModule/RouterModule";

export interface IRouter {
    routerModule: IRouterModule;
    render: () => React.ReactNode;
}
