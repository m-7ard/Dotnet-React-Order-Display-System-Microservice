import Order from "../../../../domain/models/Order";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../../components/Resuables/MixinPrototypeCard";
import { ORDER_STATUS_COLORS } from "../Orders.Constants";


export default function ServingOrderElement(props: { order: Order }) {
    const { order } = props;

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
                </div>
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
