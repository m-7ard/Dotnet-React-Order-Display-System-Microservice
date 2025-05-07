import { useMutation } from "@tanstack/react-query";
import ManageOrderPage from "./ManageOrder.Page";
import IPresentationError from "../../../interfaces/IPresentationError";
import useItemManager from "../../../hooks/useItemManager";
import OrderItem from "../../../../domain/models/OrderItem";
import OrderStatus from "../../../../domain/valueObjects/Order/OrderStatus";
import OrderItemStatus from "../../../../domain/valueObjects/OrderItem/OrderItemStatus";
import { useRouterLoaderData } from "../../../routes/RouterModule/RouterModule.hooks";
import { useCallback, useEffect, useState } from "react";
import Order from "../../../../domain/models/Order";
import { useEventServiceContext } from "../../Application.EventServiceProvider.Context";
import { useOrderDataAccessBridgeContext } from "../../../components/DataAccess/OrderDataAccessBridge/OrderDataAccessBridge";

export default function ManageOrderController() {
    // deps
    const loaderData = useRouterLoaderData((keys) => keys.MANAGE_ORDER);
    const { orderEventService } = useEventServiceContext();
    const orderDataAccessBridge = useOrderDataAccessBridgeContext();

    // state
    const errorsManager = useItemManager<IPresentationError<Record<string | number, unknown>>>({ _: undefined });
    const [storedOrder, setStoredOrder] = useState(loaderData.order);

    // effect
    useEffect(() => {
        const fn = orderEventService.registerUpdateOrder((order) => {
            setStoredOrder(order);
        });

        return () => {
            orderEventService.removeListener(fn);
        };
    }, [orderEventService]);

    // fetchers
    const markOrderFinishedMutation = useMutation({
        mutationFn: async (variables: { order: Order }) => {
            const { order } = variables;
            if (!order.canMarkFinished()) {
                return;
            }

            errorsManager.setAll({});
            await orderDataAccessBridge.markOrderFinished(
                {
                    orderId: order.id,
                },
                {
                    onSuccess: (res) => {
                        order.status = OrderStatus.FINISHED;
                        order.dateFinished = new Date(res.dateFinished);
                    },
                    onError: (errors) => {
                        errorsManager.updateItem(
                            "_",
                            Object.values(errors).flatMap((messages) => messages),
                        );
                    },
                },
            );
        },
    });

    const markOrderItemFinishedMutation = useMutation({
        mutationFn: async (variables: { orderItem: OrderItem }) => {
            const { orderItem } = variables;
            if (!orderItem.canMarkFinished()) {
                return;
            }

            errorsManager.setAll({});
            await orderDataAccessBridge.markOrderItemFinished(
                {
                    orderId: storedOrder.id,
                    orderItemId: orderItem.id,
                },
                {
                    onSuccess: (res) => {
                        orderItem.status = OrderItemStatus.FINISHED;
                        orderItem.dateFinished = new Date(res.dateFinished);
                    },
                    onError: (errors) => {
                        errorsManager.updateItem(
                            orderItem.id,
                            Object.values(errors).flatMap((messages) => messages),
                        );
                    },
                },
            );
        },
    });

    const markOrderFinished = useCallback(() => markOrderFinishedMutation.mutate({ order: storedOrder }), [markOrderFinishedMutation, storedOrder]);
    const markOrderItemFinished = useCallback((orderItem: OrderItem) => markOrderItemFinishedMutation.mutate({ orderItem: orderItem }), [markOrderItemFinishedMutation]);

    return <ManageOrderPage order={storedOrder} errors={errorsManager.items} onMarkFinished={markOrderFinished} onMarkOrderItemFinished={markOrderItemFinished} />;
}
