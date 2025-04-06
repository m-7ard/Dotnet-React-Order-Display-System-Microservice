import MixinButton from "../../components/Resuables/MixinButton";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import ProductHistory from "../../../domain/models/IProductHistory";
import OrderByMenu from "./ProductHistories.Page.OrderByMenu";
import FilterProductHistoriesController from "./Filter/FilterProductHistories.Controller";
import ProductHistoryElement from "./ProductHistories.Page.ProductHistoryElement";
import Divider from "../../components/Resuables/Divider";
import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/renderAbstractTooltip/AbstractTooltip";
import contentGridDirective from "../../directives/contentGridDirective";
import LinkBoxV2 from "../../components/Resuables/LinkBoxV2";

export default function ProductHistoriesPage(props: { productHistories: ProductHistory[] }) {
    const { productHistories } = props;

    return (
        <MixinPage directives={[contentGridDirective(() => ({}))]} exp={(options) => ({ size: options.SIZE.BASE })}>
            <MixinPageSection className="flex flex-row gap-3 items-center overflow-x-auto shrink-0">
                <LinkBoxV2 exp={(routes) => routes.LIST_PRODUCT_HISTORIES} params={{}} />
                <div className="flex flex-row gap-3 ml-auto">
                    <GlobalDialog
                        zIndex={10}
                        Trigger={({ onToggle }) => (
                            <MixinButton
                                className="justify-center w-full basis-1/2"
                                options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                onClick={onToggle}
                                hasShadow
                            >
                                Filter
                            </MixinButton>
                        )}
                        Panel={FilterProductHistoriesController}
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
            <Divider></Divider>
            <MixinPageSection className="grid grid-cols-2 max-[576px]:grid-cols-2 max-[445px]:grid-cols-1 gap-3">
                {productHistories.map((productHistory) => (
                    <ProductHistoryElement productHistory={productHistory} key={productHistory.id} />
                ))}
            </MixinPageSection>
        </MixinPage>
    );
}
