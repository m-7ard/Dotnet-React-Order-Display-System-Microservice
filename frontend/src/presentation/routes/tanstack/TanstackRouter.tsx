/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, RouterProvider } from "@tanstack/react-router";
import { IRouter } from "../interfaces/IRouter";
import tanstackRouterModule from "./tanstackRouterModule";

export default class TanstackRouter implements IRouter {
    router: Router<any, any, any>;

    constructor(router: Router<any, any, any>) {
        this.router = router;
    }

    render() {
        return <RouterProvider router={this.router} />
    }

    routerModule = tanstackRouterModule;
}