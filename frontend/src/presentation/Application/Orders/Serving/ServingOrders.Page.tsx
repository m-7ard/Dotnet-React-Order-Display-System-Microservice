import Order from "../../../../domain/models/Order";
import Divider from "../../../components/Resuables/Divider";
import MixinPage, { MixinPageSection } from "../../../components/Resuables/MixinPage";
import contentGridDirective from "../../../directives/contentGridDirective";
import ServingOrderElement from "./ServingOrders.Page.OrderElement";


export default function ServingOrdersPage(props: { orders: Order[], liveUpdatesEnabled: boolean }) {
    const { orders } = props;

    return (
        <MixinPage
            exp={(options) => ({ size: options.SIZE.BASE })}
            className={`overflow-hidden`}
            directives={[contentGridDirective((options) => ({ defaultTracks: options.DEFAULT_TRACKS.FULL }))]}
        >
            <MixinPageSection className="flex flex-row gap-3 items-center overflow-x-auto shrink-0">
                <div className="token-default-title">
                    Now Serving
                </div>
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-col grow overflow-scroll sm:overflow-x-scroll sm:overflow-y-hidden">
                <div className="flex flex-col max-h-full gap-3 grow sm:flex-wrap sm:content-start">
                    {orders.map((order) => (
                        <ServingOrderElement order={order} key={order.id} />
                    ))}
                </div>
            </MixinPageSection>
        </MixinPage>
    );
}
