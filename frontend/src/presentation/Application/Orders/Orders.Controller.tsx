import { useRouterLoaderData } from "../../routes/RouterModule/RouterModule.hooks";
import OrdersPage from "./Orders.Page";

export default function OrdersController() {
    const { orders } = useRouterLoaderData((keys) => keys.LIST_ORDERS);
    return <OrdersPage orders={orders} />;
}
