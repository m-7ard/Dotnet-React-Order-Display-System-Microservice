import { useMutation } from "@tanstack/react-query";
import ManageOrderPage from "./ManageOrder.Page";
import useResponseHandler from "../../../hooks/useResponseHandler";
import IPresentationError from "../../../interfaces/IPresentationError";
import useItemManager from "../../../hooks/useItemManager";
import { err, ok } from "neverthrow";
import IPlainApiError from "../../../../infrastructure/interfaces/IPlainApiError";
import OrderItem from "../../../../domain/models/OrderItem";
import IOrderDataAccess from "../../../interfaces/dataAccess/IOrderDataAccess";
import OrderStatus from "../../../../domain/valueObjects/Order/OrderStatus";
import OrderItemStatus from "../../../../domain/valueObjects/OrderItem/OrderItemStatus";
import IMarkOrderFinishedResponseDTO from "../../../../infrastructure/contracts/orders/markFinished/IMarkOrderFinishedResponseDTO";
import IMarkOrderItemFinishedResponseDTO from "../../../../infrastructure/contracts/orderItems/markFinished/IMarkOrderItemFinishedResponseDTO";
import { useRouterLoaderData } from "../../../routes/RouterModule/RouterModule.hooks";

export default function ManageOrderRoute(props: { orderDataAccess: IOrderDataAccess }) {
    const { orderDataAccess } = props;
    const { order } = useRouterLoaderData((keys) => keys.MANAGE_ORDER);
    const responseHandler = useResponseHandler();
    const errorsManager = useItemManager<IPresentationError<Record<string | number, unknown>>>({ _: undefined });

    const markOrderFinishedMutation = useMutation({
        mutationFn: async () => {
            if (!order.canMarkFinished()) {
                return;
            }

            errorsManager.setAll({});
            await responseHandler({
                requestFn: () =>
                    orderDataAccess.markOrderFinished({
                        orderId: order.id,
                    }),
                onResponseFn: async (response) => {
                    if (response.ok) {
                        const body: IMarkOrderFinishedResponseDTO = await response.json();
                        order.status = OrderStatus.FINISHED;
                        order.dateFinished = new Date(body.dateFinished);
                        return ok(undefined);
                    }

                    if (response.status === 400) {
                        const errors: IPlainApiError[] = await response.json();
                        errorsManager.updateItem(
                            "_",
                            errors.map(({ message }) => message),
                        );
                        return ok(undefined);
                    }

                    return err(undefined);
                },
            });
        },
    });

    const markOrderItemFinishedMutation = useMutation({
        mutationFn: async (variables: { orderItem: OrderItem }) => {
            const { orderItem } = variables;
            if (!orderItem.canMarkFinished()) {
                return;
            }

            errorsManager.setAll({});
            await responseHandler({
                requestFn: () =>
                    orderDataAccess.markOrderItemFinished({
                        orderId: order.id,
                        orderItemId: orderItem.id,
                    }),
                onResponseFn: async (response) => {
                    if (response.ok) {
                        const body: IMarkOrderItemFinishedResponseDTO = await response.json();
                        orderItem.status = OrderItemStatus.FINISHED;
                        orderItem.dateFinished = new Date(body.dateFinished);
                        return ok(undefined);
                    }

                    if (response.status === 400) {
                        const errors: IPlainApiError[] = await response.json();
                        errorsManager.updateItem(
                            orderItem.id,
                            errors.map(({ message }) => message),
                        );
                        return ok(undefined);
                    }

                    return err(undefined);
                },
            });
        },
    });

    return (
        <ManageOrderPage
            order={order}
            errors={errorsManager.items}
            onMarkFinished={markOrderFinishedMutation.mutate}
            onMarkOrderItemFinished={(orderItem) => markOrderItemFinishedMutation.mutate({ orderItem: orderItem })}
        />
    );
}
