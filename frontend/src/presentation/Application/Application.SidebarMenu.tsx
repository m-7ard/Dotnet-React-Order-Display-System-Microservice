import { useGlobalDialogPanelContext } from "../components/Dialog/GlobalDialog.Panel.Context";
import MixinButton from "../components/Resuables/MixinButton/MixinButton";
import Divider from "../components/Resuables/Divider";
import { RenderedMixinPanel, PolymorphicMixinPanelSection } from "../components/Resuables/MixinPanel";
import RouterLink from "../components/Resuables/RouterLink";
import { useRouterLocationEq } from "../routes/RouterModule/RouterModule.hooks";

export default function SidebarMenuDialog() {
    const { onClose } = useGlobalDialogPanelContext();
    const locationEq = useRouterLocationEq()

    return (
        <RenderedMixinPanel
            exp={(options) => ({ hasBorder: true, hasShadow: true, size: options.SIZE.BASE, theme: options.THEMES.GENERIC_WHITE })}
            className="top-0 bottom-0 left-0 fixed w-72 rounded-none"
        >
            {(mixinPanelProps) => (
                <div {...mixinPanelProps}>
                    <PolymorphicMixinPanelSection className="flex flex-row justify-between items-center">
                        <div className="text-sm font-semibold">Menu</div>
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
                        <RouterLink className="w-full" exp={(routes) => routes.FRONTPAGE} params={{}}>
                            <MixinButton
                                className="w-full justify-center"
                                options={{
                                    size: "mixin-button-base",
                                    theme: "theme-button-generic-white",
                                }}
                                active={locationEq((routes) => routes.FRONTPAGE)}
                            >
                                Frontpage
                            </MixinButton>
                        </RouterLink>
                        <RouterLink className="w-full" exp={(routes) => routes.LIST_PRODUCTS} params={{}}>
                            <MixinButton
                                className="w-full justify-center"
                                options={{
                                    size: "mixin-button-base",
                                    theme: "theme-button-generic-white",
                                }}
                                active={locationEq((routes) => routes.LIST_PRODUCTS)}
                            >
                                Products
                            </MixinButton>
                        </RouterLink>
                        <RouterLink className="w-full" exp={(routes) => routes.LIST_ORDERS} params={{}}>
                            <MixinButton
                                className="w-full justify-center"
                                options={{
                                    size: "mixin-button-base",
                                    theme: "theme-button-generic-white",
                                }}
                                active={locationEq((routes) => routes.LIST_ORDERS)}
                            >
                                Orders
                            </MixinButton>
                        </RouterLink>
                        <RouterLink className="w-full" exp={(routes) => routes.LIST_PRODUCT_HISTORIES} params={{}}>
                            <MixinButton
                                className="w-full justify-center"
                                options={{
                                    size: "mixin-button-base",
                                    theme: "theme-button-generic-white",
                                }}
                                active={locationEq((routes) => routes.LIST_PRODUCT_HISTORIES)}
                            >
                                Product Histories
                            </MixinButton>
                        </RouterLink>
                    </PolymorphicMixinPanelSection>
                </div>
            )}
        </RenderedMixinPanel>
    );
}
