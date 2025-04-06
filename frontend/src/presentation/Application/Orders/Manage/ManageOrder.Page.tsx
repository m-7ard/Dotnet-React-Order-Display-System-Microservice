import MixinButton from "../../../components/Resuables/MixinButton";
import OrderItem from "../../../../domain/models/OrderItem";
import IPresentationError from "../../../interfaces/IPresentationError";
import OrderStatus from "../../../../domain/valueObjects/Order/OrderStatus";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../../components/Resuables/MixinPrototypeCard";
import Order from "../../../../domain/models/Order";
import OrderItemElement from "./ManageOrder.Page.OrderItem";
import Divider from "../../../components/Resuables/Divider";
import MixinPage, { MixinPageSection } from "../../../components/Resuables/MixinPage";
import GlobalDialog from "../../../components/Dialog/GlobalDialog";
import OrderProgressPanel from "./ManageOrder.Page.ProgressPanel";
import { ORDER_STATUS_COLORS } from "../Orders.Constants";
import contentGridDirective from "../../../directives/contentGridDirective";
import LinkBoxV2 from "../../../components/Resuables/LinkBoxV2";

export default function ManageOrderPage(props: {
    order: Order;
    onMarkFinished: () => void;
    onMarkOrderItemFinished: (orderItem: OrderItem) => void;
    errors: IPresentationError<Record<string | number, unknown>>;
}) {
    const { order, onMarkFinished, onMarkOrderItemFinished } = props;

    return (
        <MixinPage exp={(options) => ({ size: options.SIZE.BASE })} directives={[contentGridDirective(() => ({}))]}>
            <MixinPageSection className="flex flex-row gap-3 items-center">
                <LinkBoxV2 exp={(routes) => routes.MANAGE_ORDER} params={{ id: order.id }} />
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-col gap-3">
                <MixinPrototypeCard options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }} hasDivide hasShadow>
                    <MixinPrototypeCardSection className={`flex flex-col ${ORDER_STATUS_COLORS[order.status.value]}`}>
                        <div className="flex flex-row justify-between items-baseline">
                            <div className="token-card--header--primary-text">Order #{order.serialNumber}</div>
                            <div className="token-card--header--primary-text">{`${order.status.value}`}</div>
                        </div>
                        <div className="flex flex-row justify-between items-baseline">
                            <div className="token-card--header--secondary-text">{order.dateCreated.toLocaleTimeString()}</div>
                            <div className="token-card--header--secondary-text">{order.total}$</div>
                        </div>
                    </MixinPrototypeCardSection>
                    <MixinPrototypeCardSection>
                        <div className="flex flex-row gap-3">
                            {order.status === OrderStatus.PENDING && (
                                <>
                                    <MixinButton
                                        className={`basis-1/2 justify-center ${order.canMarkFinished() ? "" : "contrast-50 cursor-not-allowed"}`}
                                        options={{ size: "mixin-button-sm", theme: "theme-button-generic-green" }}
                                        onClick={onMarkFinished}
                                    >
                                        Mark Finished
                                    </MixinButton>
                                    <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                                        Other Options
                                    </MixinButton>
                                </>
                            )}
                            {order.status === OrderStatus.FINISHED && (
                                <>
                                    <GlobalDialog
                                        zIndex={10}
                                        Trigger={({ onToggle }) => (
                                            <MixinButton
                                                className="basis-1/2 justify-center"
                                                options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                                onClick={onToggle}
                                            >
                                                Order Progress
                                            </MixinButton>
                                        )}
                                        Panel={OrderProgressPanel}
                                        panelProps={{ order: order }}
                                    />
                                    <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                                        Other Options
                                    </MixinButton>
                                </>
                            )}
                        </div>
                    </MixinPrototypeCardSection>
                </MixinPrototypeCard>
                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
                    {order.orderItems.map((orderItem) => (
                        <OrderItemElement orderItem={orderItem} key={orderItem.id} onMarkOrderItenFinished={() => onMarkOrderItemFinished(orderItem)} />
                    ))}
                </div>
            </MixinPageSection>
        </MixinPage>
    );
}
