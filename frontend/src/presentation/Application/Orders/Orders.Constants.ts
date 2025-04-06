import OrderStatus from "../../../domain/valueObjects/Order/OrderStatus";
import OrderItemStatus from "../../../domain/valueObjects/OrderItem/OrderItemStatus";

export const ORDER_ITEM_STATUS_COLORS = {
    [OrderItemStatus.FINISHED.value]: "bg-emerald-300",
    [OrderItemStatus.PENDING.value]: "bg-orange-300",
};

export const ORDER_STATUS_COLORS = {
    [OrderStatus.FINISHED.value]: "bg-emerald-300",
    [OrderStatus.PENDING.value]: "bg-orange-300",
};
