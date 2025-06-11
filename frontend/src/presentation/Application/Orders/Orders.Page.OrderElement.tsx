import Order from "../../../domain/models/Order";
import MixinButton from "../../components/Resuables/MixinButton/MixinButton";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";
import { useRouterNavigate } from "../../routes/RouterModule/RouterModule.hooks";
import { ORDER_STATUS_COLORS, ORDER_ITEM_STATUS_COLORS } from "./Orders.Constants";

export default function OrderElement(props: { order: Order }) {
    const { order } = props;
    const navigate = useRouterNavigate();

    const orderDate = order.dateCreated.toLocaleDateString();
    const orderTime = order.dateCreated.toLocaleTimeString();
    const orderDateTime = `${orderDate} at ${orderTime}`;

    return (
        <MixinPrototypeCard
            as="article"
            options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }}
            className="shrink-0 max-w-72 w-full sm:max-h-full flex flex-col overflow-auto"
            hasShadow
            hasDivide
            role="article"
            aria-label={`Order ${order.serialNumber}, ${order.status.value}, total ${order.total} dollars`}
        >
            <MixinPrototypeCardSection 
                as="header"
                className={`flex flex-col sticky top-0 ${ORDER_STATUS_COLORS[order.status.value]}`}
                role="banner"
                aria-label="Order header information"
            >
                <div className="flex flex-row justify-between items-baseline">
                    <h2 className="token-card--header--primary-text" id={`order-${order.serialNumber}-title`}>
                        Order #{order.serialNumber}
                    </h2>
                    <div 
                        className="token-card--header--primary-text"
                        role="status"
                        aria-label={`Order status: ${order.status.value}`}
                    >
                        {order.status.value}
                    </div>
                </div>
                <div className="flex flex-row justify-between items-baseline">
                    <time 
                        className="token-card--header--secondary-text"
                        dateTime={order.dateCreated.toISOString()}
                        aria-label={`Order created on ${orderDateTime}`}
                    >
                        {order.dateCreated.toLocaleTimeString()}
                    </time>
                    <div 
                        className="token-card--header--secondary-text"
                        role="text"
                        aria-label={`Order total: ${order.total} dollars`}
                    >
                        {order.total}$
                    </div>
                </div>
            </MixinPrototypeCardSection>
            
            {order.orderItems.map((orderItem, i) => (
                <MixinPrototypeCardSection 
                    as="section"
                    className={`flex flex-col gap-3 ${i === 0 ? "" : "border-gray-900 border-t"}`} 
                    key={orderItem.serialNumber}
                    aria-labelledby={`item-${orderItem.serialNumber}-name`}
                    aria-describedby={`item-${orderItem.serialNumber}-details`}
                >
                    <div className="flex flex-col gap-1" id={`item-${orderItem.serialNumber}-details`}>
                        <div className="token-default-list" role="group" aria-label="Product information">
                            <div className="flex flex-row gap-[inherit] items-center">
                                <MixinButton
                                    options={{
                                        size: "mixin-button-sm",
                                        theme: "theme-button-generic-white",
                                    }}
                                    isStatic
                                    aria-label={`Quantity: ${orderItem.quantity}`}
                                    role="text"
                                >
                                    x{orderItem.quantity}
                                </MixinButton>
                                <div 
                                    className="token-default-list__label"
                                    id={`item-${orderItem.serialNumber}-name`}
                                    role="text"
                                >
                                    {orderItem.productHistory.name}
                                </div>
                            </div>
                            <div 
                                className="token-default-list__value"
                                role="text"
                                aria-label={`Unit price: ${orderItem.productHistory.price} dollars`}
                            >
                                {orderItem.productHistory.price}$
                            </div>
                        </div>
                        <div className="token-default-list" role="group" aria-label="Order item status and total">
                            <div className="flex flex-row gap-[inherit] items-center">
                                <div 
                                    className={`mixin-button-like mixin-button-like--static mixin-button-sm ${ORDER_ITEM_STATUS_COLORS[orderItem.status.value]}`}
                                    role="status"
                                    aria-label={`Item status: ${orderItem.status.value}`}
                                >
                                    {orderItem.status.value}
                                </div>
                            </div>
                            <div 
                                className="token-default-list__value"
                                role="text"
                                aria-label={`Item total: ${orderItem.getTotal()} dollars`}
                            >
                                Total - {orderItem.getTotal()}$
                            </div>
                        </div>
                    </div>
                </MixinPrototypeCardSection>
            ))}

            <MixinPrototypeCardSection
                as="footer"
                onClick={(e) => {
                    e.preventDefault();
                    navigate({ exp: (routes) => routes.MANAGE_ORDER, params: { id: order.id } });
                }}
                className="flex flex-row shrink-0 sticky bottom-0"
                fillBg
                role="contentinfo"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate({ exp: (routes) => routes.MANAGE_ORDER, params: { id: order.id } });
                    }
                }}
                aria-label={`Manage order ${order.serialNumber}`}
            >
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: "theme-button-generic-yellow",
                    }}
                    className="w-full justify-center"
                    aria-describedby={`order-${order.serialNumber}-title`}
                >
                    Manage Order
                </MixinButton>
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}