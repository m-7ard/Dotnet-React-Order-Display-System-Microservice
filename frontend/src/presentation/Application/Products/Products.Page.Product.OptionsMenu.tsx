import IProduct from "../../../domain/models/IProduct";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import MixinButton from "../../components/Resuables/MixinButton/MixinButton";
import { useAbstractTooltipContext } from "../../components/renderAbstractTooltip/AbstractTooltip.Context";
import DeleteProductFactory from "./Delete/DeleteProduct.Factory";
import Divider from "../../components/Resuables/Divider";
import { PolymorphicAbstractTooltipDefaultPanel } from "../../components/renderAbstractTooltip/AbstractTooltip";
import { PolymorphicMixinPanel, PolymorphicMixinPanelSection } from "../../components/Resuables/MixinPanel";
import { useRouterModule } from "../../routes/RouterModule/RouterModule.hooks";

export default function ProductOptionMenu(props: { product: IProduct }) {
    const { product } = props;
    const { onClose } = useAbstractTooltipContext();
    const { useRouterNavigate } = useRouterModule();
    const navigate = useRouterNavigate();

    return (
        <PolymorphicAbstractTooltipDefaultPanel className={`z-10 fixed mt-1`}>
            <PolymorphicMixinPanel exp={(options) => ({ hasBorder: true, hasShadow: true, size: options.SIZE.BASE, theme: options.THEMES.GENERIC_WHITE })}>
                <PolymorphicMixinPanelSection className="flex flex-row items-center justify-between gap-3">
                    <div className="text-sm">Other Options</div>
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-white",
                        }}
                        onClick={onClose}
                        hasShadow
                        type="button"
                    >
                        Close
                    </MixinButton>
                </PolymorphicMixinPanelSection>
                <Divider />
                <PolymorphicMixinPanelSection className="flex flex-col gap-1">
                    <a
                        className="w-full"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate({ exp: (routes) => routes.UPDATE_PRODUCT, params: { id: product.id } });
                        }}
                    >
                        <MixinButton className="justify-center truncate w-full" type="button" options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}>
                            Update Product
                        </MixinButton>
                    </a>
                    <a
                        className="w-full"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate({ exp: (routes) => routes.UPDATE_PRODUCT_AMOUNT, params: { id: product.id } });
                        }}
                    >
                        <MixinButton className="justify-center truncate w-full" type="button" options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}>
                            Update Amount
                        </MixinButton>
                    </a>
                    <GlobalDialog
                        zIndex={20}
                        Trigger={({ onToggle }) => (
                            <MixinButton
                                className="justify-center w-full"
                                type="button"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-red" }}
                                onClick={() => {
                                    onToggle();
                                    onClose();
                                }}
                            >
                                Delete Product
                            </MixinButton>
                        )}
                        Panel={() => <DeleteProductFactory product={product} />}
                        panelProps={{ product: product }}
                    />
                    <a
                        className="w-full truncate"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate({ exp: (routes) => routes.LIST_PRODUCT_HISTORIES, params: {}, search: { productId: product.id } });
                        }}
                    >
                        <MixinButton className="justify-center w-full" type="button" options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }}>
                            See Product History
                        </MixinButton>
                    </a>
                </PolymorphicMixinPanelSection>
            </PolymorphicMixinPanel>
        </PolymorphicAbstractTooltipDefaultPanel>
    );
}
