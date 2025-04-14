import { createRouter } from "@tanstack/react-router";
import rootRoute from "../routes/tanstack/rootRoute";
import productRoutes from "../routes/tanstack/children/products/productRoutes";
import applicationRoutes from "../routes/tanstack/children/applicationRoutes";
import orderRoutes from "../routes/tanstack/children/orders/orderRoutes";
import productHistoryRoutes from "../routes/tanstack/children/product_histories/productHistoryRoutes";
import errorRoutes from "../routes/tanstack/children/errorRoutes";
import userRoutes from "../routes/tanstack/children/users/userRoutes";


const routeTree = rootRoute.addChildren([
    ...applicationRoutes,
    ...productRoutes,
    ...orderRoutes,
    ...productHistoryRoutes,
    ...errorRoutes,
    ...userRoutes    
]);

const tanstackRouter = createRouter({
    routeTree,
    defaultGcTime: 0,
});

declare module "@tanstack/react-router" {
    interface Register {
        tanstackRouter: typeof tanstackRouter;
    }
}

export default tanstackRouter;