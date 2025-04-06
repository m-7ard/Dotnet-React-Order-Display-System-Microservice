import { useRouterState } from "@tanstack/react-router";
import tanstackRouter from "../deps/tanstackRouter";

type RouterState = ReturnType<typeof useRouterState<typeof tanstackRouter>>;

type TanstackRouterState = RouterState & {
    location: {
        state: {
            error?: Error 
        }
    }
};

export default TanstackRouterState;