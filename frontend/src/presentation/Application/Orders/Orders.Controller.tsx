import { useEffect, useState } from "react";
import { useRouterLoaderData } from "../../routes/RouterModule/RouterModule.hooks";
import { useEventServiceContext } from "../Application.EventServiceProvider.Context";
import OrdersPage from "./Orders.Page";
import { OrderEventServiceEventTypes } from "../../../infrastructure/interfaces/eventServices/IOrderEventService";
import Order from "../../../domain/models/Order";

type OrdersById = {
    [id: string]: Order;
}

const reduceOrders = (orders: Order[]) => orders.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
}, {} as OrdersById)

export default function OrdersController() {
    const { orders } = useRouterLoaderData((keys) => keys.LIST_ORDERS);
    const { orderEventService, open } = useEventServiceContext();
    const [storedOrder, setStoredOrders] = useState<OrdersById>(reduceOrders(orders));

    useEffect(() => {
        const listener = orderEventService.registerCreateOrder((order) => {
            setStoredOrders((prev) => {
                const newValue = { ...prev };
                newValue[order.id] = order;
                return newValue;
            })
        });

        return () => {
            orderEventService.removeListener(listener);
        }
    }, [orderEventService])

    return <OrdersPage orders={Object.values(storedOrder)} liveUpdatesEnabled={open} />;
}
