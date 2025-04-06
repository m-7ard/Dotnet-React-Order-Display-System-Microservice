import OrderItem from "../../../../domain/models/OrderItem";
import OrderItemStatus from "../../../../domain/valueObjects/OrderItem/OrderItemStatus";
import { getApiUrl } from "../../../../viteUtils";
import GlobalDialog from "../../../components/Dialog/GlobalDialog";
import CoverImage from "../../../components/Resuables/CoverImage";
import MixinButton from "../../../components/Resuables/MixinButton";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../../components/Resuables/MixinPrototypeCard";
import { ORDER_ITEM_STATUS_COLORS } from "../Orders.Constants";
import OrderItemProgressPanel from "./ManageOrder.Page.OrderItem.ProgressPanel";

export default function OrderItemElement(props: { orderItem: OrderItem; onMarkOrderItenFinished: () => void }) {
    const { orderItem, onMarkOrderItenFinished } = props;

    return (
        <MixinPrototypeCard
            key={orderItem.id}
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
            hasDivide
            hasShadow
        >
            <MixinPrototypeCardSection className={`flex flex-col ${ORDER_ITEM_STATUS_COLORS[orderItem.status.value]}`}>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="token-card--header--primary-text">Order Item #{orderItem.serialNumber}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-col gap-3">
                <div className="w-full flex flex-row justify-between p-1 shrink-0 border token-default-border-color h-16 rounded-lg">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <CoverImage
                            className="token-default-avatar"
                            src={orderItem.productHistory.images[i] == null ? undefined : `${getApiUrl()}/Media/${orderItem.productHistory.images[i]}`}
                            key={i}
                        />
                    ))}
                </div>
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
            <MixinPrototypeCardSection>
                <div className="flex flex-row gap-3">
                    {orderItem.canMarkFinished() && (
                        <>
                            <MixinButton
                                className="basis-1/2 justify-center"
                                options={{ size: "mixin-button-sm", theme: "theme-button-generic-green" }}
                                onClick={onMarkOrderItenFinished}
                            >
                                Mark Finished
                            </MixinButton>
                            <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                                Other Options
                            </MixinButton>
                        </>
                    )}
                    {orderItem.status === OrderItemStatus.FINISHED && (
                        <>
                            <GlobalDialog
                                zIndex={10}
                                Trigger={({ onToggle }) => (
                                    <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }} onClick={onToggle}>
                                        Item Progress
                                    </MixinButton>
                                )}
                                Panel={OrderItemProgressPanel}
                                panelProps={{ orderItem: orderItem}}
                            />
                            <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                                Other Options
                            </MixinButton>
                        </>
                    )}
                </div>
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
