import ProductHistory from "../../../domain/models/IProductHistory";
import MixinButton from "../../components/Resuables/MixinButton";
import { useAbstractTooltipContext } from "../../components/renderAbstractTooltip/AbstractTooltip.Context";
import Divider from "../../components/Resuables/Divider";
import { PolymorphicAbstractTooltipDefaultPanel } from "../../components/renderAbstractTooltip/AbstractTooltip";
import { PolymorphicMixinPanel, PolymorphicMixinPanelSection } from "../../components/Resuables/MixinPanel";
import { useRouterNavigate } from "../../routes/RouterModule/RouterModule.hooks";

export default function OptionMenu(props: { productHistory: ProductHistory }) {
    const { productHistory } = props;
    const navigate = useRouterNavigate();
    const { onClose } = useAbstractTooltipContext();

    return (
        <PolymorphicAbstractTooltipDefaultPanel className={`z-10 fixed mt-1`}>
            <PolymorphicMixinPanel exp={(options) => ({ hasBorder: true, hasShadow: true, size: options.SIZE.BASE, theme: options.THEMES.GENERIC_WHITE })}>
                <PolymorphicMixinPanelSection className="flex flex-row items-center justify-between">
                    <div className="text-sm">Other Options</div>
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-white",
                        }}
                        onClick={onClose}
                        type="button"
                        hasShadow
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
                            navigate({ exp: (routes) => routes.LIST_PRODUCTS, params: {}, search: { id: productHistory.productId } });
                        }}
                    >
                        <MixinButton className="justify-center w-full" type="button" options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}>
                            See Products
                        </MixinButton>
                    </a>
                </PolymorphicMixinPanelSection>
            </PolymorphicMixinPanel>
        </PolymorphicAbstractTooltipDefaultPanel>
    );
}
