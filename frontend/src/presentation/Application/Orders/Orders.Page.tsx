import MixinButton from "../../components/Resuables/MixinButton";
import Order from "../../../domain/models/Order";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import OrderElement from "./Orders.Page.OrderElement";
import OrderByMenu from "./Orders.Page.OrderByMenu";
import FilterOrdersController from "./Filter/FilterOrders.Controller";
import Divider from "../../components/Resuables/Divider";
import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/renderAbstractTooltip/AbstractTooltip";
import contentGridDirective from "../../directives/contentGridDirective";
import RouterLink from "../../components/Resuables/RouterLink";
import LinkBoxV2 from "../../components/Resuables/LinkBoxV2";

export default function OrdersPage(props: { orders: Order[], liveUpdatesEnabled: boolean }) {
    const { orders } = props;
    // TODO: add a little blinking circle here to show that the websocket it live

    return (
        <MixinPage
            exp={(options) => ({ size: options.SIZE.BASE })}
            className={`overflow-hidden`}
            directives={[contentGridDirective((options) => ({ defaultTracks: options.DEFAULT_TRACKS.FULL }))]}
        >
            <MixinPageSection className="flex flex-row gap-3 items-center overflow-x-auto shrink-0">
                <LinkBoxV2 exp={(routes) => routes.LIST_ORDERS} params={{}} />
                <div className="flex flex-row gap-3 ml-auto">
                    <RouterLink exp={(routes) => routes.CREATE_ORDER} params={{}}>
                        <MixinButton className="" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }} hasShadow>
                            Create
                        </MixinButton>
                    </RouterLink>
                    <GlobalDialog
                        zIndex={10}
                        Trigger={({ onToggle }) => (
                            <MixinButton className=" basis-1/2" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }} onClick={onToggle} hasShadow>
                                Filter
                            </MixinButton>
                        )}
                        Panel={FilterOrdersController}
                        panelProps={{}}
                    />
                    <AbstractTooltip
                        Trigger={({ onToggle, open }) => (
                            <AbstractTooltipTrigger>
                                <MixinButton
                                    className="w-full truncate"
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                    onClick={onToggle}
                                    active={open}
                                    hasShadow
                                >
                                    Order By
                                </MixinButton>
                            </AbstractTooltipTrigger>
                        )}
                        Panel={OrderByMenu}
                        positioning={{ top: "100%", right: "0px" }}
                    />
                </div>
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-col grow overflow-scroll sm:overflow-x-scroll sm:overflow-y-hidden">
                <div className="flex flex-col max-h-full gap-3 grow sm:flex-wrap sm:content-start">
                    {orders.map((order) => (
                        <OrderElement order={order} key={order.id} />
                    ))}
                </div>
            </MixinPageSection>
        </MixinPage>
    );
}
