import { useEffect, useState } from "react";
import { useRouterLoaderData } from "../../routes/RouterModule/RouterModule.hooks";
import { useEventServiceContext } from "../Application.EventServiceProvider.Context";
import OrdersPage from "./Orders.Page";
import Order from "../../../domain/models/Order";

export default function OrdersController() {
    const { orders } = useRouterLoaderData((keys) => keys.LIST_ORDERS);
    const { orderEventService, open } = useEventServiceContext();
    const [storedOrder, setStoredOrders] = useState<Order[]>(orders);

    useEffect(() => {
        const listener = orderEventService.registerCreateOrder((order) => {
            setStoredOrders((prev) => ([order, ...prev]));
        });

        return () => {
            orderEventService.removeListener(listener);
        }
    }, [orderEventService]);

    return <OrdersPage orders={storedOrder} liveUpdatesEnabled={open} />;
}
