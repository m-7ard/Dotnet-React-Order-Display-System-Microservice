import GlobalDialog from "../components/Dialog/GlobalDialog";
import MixinButton from "../components/Resuables/MixinButton";
import SidebarMenuDialog from "./Application.SidebarMenu";
import Divider from "../components/Resuables/Divider";
import MixinContentGrid, { MixinContentGridTrack } from "../components/Resuables/MixinContentGrid";
import RouterLink from "../components/Resuables/RouterLink";
import { useRouterLocationEq } from "../routes/RouterModule/RouterModule.hooks";
import { useAuthServiceContext } from "./Application.AuthServiceProvider.Context";

export default function ApplicationHeader() {
    const locationEq = useRouterLocationEq();
    const { user, logout } = useAuthServiceContext();

    return (
        <>
            <MixinContentGrid className="bg-gray-50 shrink-0 z-10 relative" exp={() => ({})}>
                <MixinContentGridTrack
                    className="py-2 px-4 flex flex-row gap-3 mx-auto border-x token-default-border-color overflow-auto"
                    exp={(options) => ({ track: options.TRACK.BASE })}
                >
                    <GlobalDialog
                        zIndex={10}
                        Trigger={({ onToggle }) => (
                            <MixinButton
                                options={{
                                    size: "mixin-button-sm",
                                    theme: "theme-button-generic-white",
                                }}
                                type="button"
                                onClick={onToggle}
                                className="shrink-0 truncate"
                            >
                                <div>Menu</div>
                            </MixinButton>
                        )}
                        Panel={SidebarMenuDialog}
                        panelProps={{}}
                    ></GlobalDialog>
                    <RouterLink exp={(routes) => routes.FRONTPAGE} params={{}}>
                        <MixinButton
                            options={{
                                size: "mixin-button-sm",
                                theme: "theme-button-generic-white",
                            }}
                            active={locationEq((routes) => routes.FRONTPAGE)}
                        >
                            Frontpage
                        </MixinButton>
                    </RouterLink>
                    <RouterLink exp={(routes) => routes.LIST_PRODUCTS} params={{}}>
                        <MixinButton
                            options={{
                                size: "mixin-button-sm",
                                theme: "theme-button-generic-white",
                            }}
                            type="button"
                            active={locationEq((routes) => routes.LIST_PRODUCTS)}
                        >
                            Products
                        </MixinButton>
                    </RouterLink>
                    <RouterLink exp={(routes) => routes.LIST_PRODUCT_HISTORIES} params={{}}>
                        <MixinButton
                            options={{
                                size: "mixin-button-sm",
                                theme: "theme-button-generic-white",
                            }}
                            type="button"
                            className="truncate shrink-0"
                            active={locationEq((routes) => routes.LIST_PRODUCT_HISTORIES)}
                        >
                            Product Histories
                        </MixinButton>
                    </RouterLink>
                    <RouterLink exp={(routes) => routes.LIST_ORDERS} params={{}}>
                        <MixinButton
                            options={{
                                size: "mixin-button-sm",
                                theme: "theme-button-generic-white",
                            }}
                            type="button"
                            active={locationEq((routes) => routes.LIST_ORDERS)}
                        >
                            Orders
                        </MixinButton>
                    </RouterLink>
                    {user == null ? (
                        <div className="flex flex-row gap-[inherit]">
                            <RouterLink exp={(routes) => routes.REGISTER_USER} params={{}}>
                                <MixinButton
                                    options={{
                                        size: "mixin-button-sm",
                                        theme: "theme-button-generic-green",
                                    }}
                                    type="button"
                                    active={locationEq((routes) => routes.REGISTER_USER)}
                                >
                                    Register
                                </MixinButton>
                            </RouterLink>
                            <RouterLink exp={(routes) => routes.LOGIN_USER} params={{}}>
                                <MixinButton
                                    options={{
                                        size: "mixin-button-sm",
                                        theme: "theme-button-generic-yellow",
                                    }}
                                    type="button"
                                    active={locationEq((routes) => routes.LOGIN_USER)}
                                >
                                    Login
                                </MixinButton>
                            </RouterLink>
                        </div>
                    ) : (
                        <MixinButton
                            options={{
                                size: "mixin-button-sm",
                                theme: "theme-button-generic-red",
                            }}
                            type="button"
                            active={locationEq((routes) => routes.LIST_ORDERS)}
                            onClick={logout}
                        >
                            Logout
                        </MixinButton>
                    )}
                </MixinContentGridTrack>
            </MixinContentGrid>
            <div className="shadow relative">
                <Divider />
            </div>
        </>
    );
}
