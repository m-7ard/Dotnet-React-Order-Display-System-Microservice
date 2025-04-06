import { IRouter } from "./IRouter";
import IRouterRequestHandler from "./IRouterRequestHandler";

interface IRouterContext {
    router: IRouter;
    requestHandler: IRouterRequestHandler
}

export default IRouterContext;