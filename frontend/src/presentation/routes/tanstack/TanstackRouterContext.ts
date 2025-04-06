import IRouterContext from "../interfaces/IRouterContext";
import TanstackRequestHandler from "./TanstackRequestHandler";
import TanstackRouter from "./TanstackRouter";

class TanstackRouterContext implements IRouterContext {
    router: TanstackRouter;
    requestHandler: TanstackRequestHandler;

    constructor(router: TanstackRouter, requestHandler: TanstackRequestHandler) {
        this.router = router;
        this.requestHandler = requestHandler;
    }
}

export default TanstackRouterContext;
