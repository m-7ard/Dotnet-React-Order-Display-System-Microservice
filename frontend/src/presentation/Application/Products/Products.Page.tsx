import MixinButton from "../../components/Resuables/MixinButton/MixinButton";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import OrderByMenu from "./Products.Page.OrderByMenu";
import IProduct from "../../../domain/models/IProduct";
import ProductElement from "./Products.Page.ProductElement";
import FilterProductsController from "./Filter/FilterProducts.Controller";
import Divider from "../../components/Resuables/Divider";
import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/renderAbstractTooltip/AbstractTooltip";
import contentGridDirective from "../../directives/contentGridDirective";
import LinkBoxV2 from "../../components/Resuables/LinkBoxV2";
import RouterLink from "../../components/Resuables/RouterLink";

export default function ProductsPage(props: { products: IProduct[] }) {
    const { products } = props;

    return (
        <MixinPage directives={[contentGridDirective(() => ({}))]} exp={(options) => ({ size: options.SIZE.BASE })}>
            <MixinPageSection className="flex flex-row gap-3 items-center shrink-0 overflow-x-auto">
                <LinkBoxV2 exp={(routes) => routes.LIST_PRODUCTS} params={{}} />
                <div className="flex flex-row gap-3 ml-auto">
                    <RouterLink exp={(routes) => routes.CREATE_PRODUCT} params={{}}>
                        <MixinButton className="justify-center w-full" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }} hasShadow>
                            Create
                        </MixinButton>
                    </RouterLink>
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
                        Panel={FilterProductsController}
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
            <MixinPageSection className="grid grid-cols-2 max-[576px]:grid-cols-2 max-[445px]:grid-cols-1 gap-4">
                {products.map((product) => (
                    <ProductElement product={product} key={product.id} />
                ))}
            </MixinPageSection>
        </MixinPage>
    );
}
