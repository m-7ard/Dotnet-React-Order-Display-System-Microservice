import { useEffect, useRef, useState } from "react";
import Order from "../../../../domain/models/Order";
import { useRouterLoaderData } from "../../../routes/RouterModule/RouterModule.hooks";
import { useEventServiceContext } from "../../Application.EventServiceProvider.Context";
import ServingOrdersPage from "./ServingOrders.Page";

export default function ServingOrdersController() {
    const { orders } = useRouterLoaderData((keys) => keys.SERVING_ORDERS);
    const { orderEventService, open } = useEventServiceContext();

    const [storedOrder, setStoredOrders] = useState<Order[]>(orders);
    const storedOrderIds = useRef<Set<string>>(new Set(storedOrder.map(({ id }) => id)));

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

    return <ServingOrdersPage orders={storedOrder} liveUpdatesEnabled={open} />;
}
