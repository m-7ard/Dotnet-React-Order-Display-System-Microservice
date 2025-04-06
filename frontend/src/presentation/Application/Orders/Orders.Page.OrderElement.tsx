import Order from "../../../domain/models/Order";
import MixinButton from "../../components/Resuables/MixinButton";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";
import { useRouterNavigate } from "../../routes/RouterModule/RouterModule.hooks";
import { ORDER_STATUS_COLORS, ORDER_ITEM_STATUS_COLORS } from "./Orders.Constants";

export default function OrderElement(props: { order: Order }) {
    const { order } = props;
    const navigate = useRouterNavigate();

    return (
        <MixinPrototypeCard
            options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }}
            className="shrink-0 max-w-72 w-full sm:max-h-full flex flex-col overflow-auto"
            hasShadow
            hasDivide
        >
            <MixinPrototypeCardSection className={`flex flex-col sticky top-0 ${ORDER_STATUS_COLORS[order.status.value]}`}>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="token-card--header--primary-text">Order #{order.serialNumber}</div>
                    <div className="token-card--header--primary-text">{`${order.status.value}`}</div>
                </div>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="token-card--header--secondary-text">{order.dateCreated.toLocaleTimeString()}</div>
                    <div className="token-card--header--secondary-text">{order.total}$</div>
                </div>
            </MixinPrototypeCardSection>
            {order.orderItems.map((orderItem, i) => (
                <MixinPrototypeCardSection className={`flex flex-col gap-3 ${i === 0 ? "" : "border-gray-900 border-t"}`} key={orderItem.id}>
                    <div className="flex flex-col gap-1">
                        <div className="token-default-list">
                            <div className="flex flex-row gap-[inherit] items-center">
                                <MixinButton
                                    options={{
                                        size: "mixin-button-sm",
                                        theme: "theme-button-generic-white",
                                    }}
                                    isStatic
                                >
                                    x{orderItem.quantity}
                                </MixinButton>
                                <div className="token-default-list__label">{orderItem.productHistory.name}</div>
                            </div>
                            <div className="token-default-list__value">{`${orderItem.productHistory.price}$`}</div>
                        </div>
                        <div className="token-default-list">
                            <div className="flex flex-row gap-[inherit] items-center">
                                <button className={`mixin-button-like mixin-button-like--static mixin-button-sm ${ORDER_ITEM_STATUS_COLORS[orderItem.status.value]}`}>
                                    {orderItem.status.value}
                                </button>
                            </div>
                            <div className="token-default-list__value">Total - {`${orderItem.getTotal()}$`}</div>
                        </div>
                    </div>
                </MixinPrototypeCardSection>
            ))}

            <MixinPrototypeCardSection
                as="a"
                onClick={(e) => {
                    e.preventDefault();
                    navigate({ exp: (routes) => routes.MANAGE_ORDER, params: { id: order.id } });
                }}
                className="flex flex-row shrink-0 sticky bottom-0"
                fillBg
            >
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: "theme-button-generic-yellow",
                    }}
                    className="w-full justify-center"
                >
                    Manage Order
                </MixinButton>
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
