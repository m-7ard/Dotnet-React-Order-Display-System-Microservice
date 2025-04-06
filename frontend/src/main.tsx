import { createRoot } from "react-dom/client";
import "./presentation/css/index.scss";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./presentation/deps/queryClient";
import CreateRouter from "./presentation/routes/CreateRouter";
import tanstackRouter from "./presentation/deps/tanstackRouter";
import diContainer, { DI_TOKENS } from "./presentation/deps/diContainer";
import TanstackRequestHandler from "./presentation/routes/tanstack/TanstackRequestHandler";
import TanstackRouterContext from "./presentation/routes/tanstack/TanstackRouterContext";
import TanstackRouter from "./presentation/routes/tanstack/TanstackRouter";

const router = new TanstackRouter(tanstackRouter);
const requestHandler = new TanstackRequestHandler(router);
diContainer.register(DI_TOKENS.ROUTER_CONTEXT, new TanstackRouterContext(router, requestHandler));

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <CreateRouter router={router} />
    </QueryClientProvider>,
);
