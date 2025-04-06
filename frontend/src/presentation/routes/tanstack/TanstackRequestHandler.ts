import { redirect } from "@tanstack/react-router";
import tryHandleRequest from "../../utils/routableErrors/tryHandleRequest";
import handleInvalidResponse from "../../utils/routableErrors/handleInvalidResponse";
import IRouterRequestHandler from "../interfaces/IRouterRequestHandler";
import TanstackRouter from "./TanstackRouter";

class TanstackRequestHandler implements IRouterRequestHandler {
    constructor(private readonly router: TanstackRouter) {}

    async handleRequest(promise: Promise<Response>): Promise<Response> {
        const result = await tryHandleRequest(promise);

        if (result.isErr()) {
            const route = result.error.routeExp(this.router.routerModule.genericRoutes);
            throw redirect({ to: route.config?.pattern, state: (prev) => ({ ...prev, error: result.error }) });
        }

        return result.value;
    }

    async handleInvalidResponse(response: Response): Promise<void> {
        const error = await handleInvalidResponse(response);
        const route = error.routeExp(this.router.routerModule.genericRoutes);
        throw redirect({ to: route.config?.pattern, state: (prev) => ({ ...prev, error: error }) });
    }
}

export default TanstackRequestHandler;
