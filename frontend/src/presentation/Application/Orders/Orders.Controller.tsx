import { useEffect, useRef, useState } from "react";
import { useRouterLoaderData } from "../../routes/RouterModule/RouterModule.hooks";
import { useEventServiceContext } from "../Application.EventServiceProvider.Context";
import OrdersPage from "./Orders.Page";
import Order from "../../../domain/models/Order";

export default function OrdersController() {
    const { orders } = useRouterLoaderData((keys) => keys.LIST_ORDERS);
    const { orderEventService, open } = useEventServiceContext();

    const [storedOrders, setStoredOrders] = useState<Order[]>(orders);
    const storedOrderIds = useRef<Set<string>>(new Set(storedOrders.map(({ id }) => id)));

    useEffect(() => {
        setStoredOrders(orders);
    }, [orders]);

    useEffect(() => {
        const createdIdentifier = orderEventService.registerCreateOrder((order) => {
            if (storedOrderIds.current.has(order.id)) return;
            setStoredOrders((prev) => [order, ...prev]);
            storedOrderIds.current.add(order.id);
        });

        const updatedIdentifier = orderEventService.registerUpdateOrder((order) => {
            if (!storedOrderIds.current.has(order.id)) return;
            setStoredOrders((prev) => {
                const newValue = [...prev];
                const index = newValue.findIndex((item) => item.id === order.id);
                newValue[index] = order;
                return newValue;
            });
        });

        return () => {
            orderEventService.removeListener(createdIdentifier);
            orderEventService.removeListener(updatedIdentifier);
        };
    }, [orderEventService]);

    return <OrdersPage orders={storedOrders} liveUpdatesEnabled={open} />;
}
