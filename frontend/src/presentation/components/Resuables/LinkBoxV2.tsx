import React from "react";
import MixinButton from "./MixinButton";
import { TAnyGenericRoute, ICommonRouteMapping, TExtractGenericRouteParams, isLayoutRoute } from "../../routes/routeTypes";
import RouterLink from "./RouterLink";
import { useRouterModule } from "../../routes/RouterModule/RouterModule.hooks";

export default function LinkBoxV2<T extends TAnyGenericRoute>({ exp, params }: { exp: (keys: ICommonRouteMapping) => T; params: TExtractGenericRouteParams<T> }) {
    const linkParts: Array<{
        label: string;
        route: TAnyGenericRoute;
    }> = [];

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { genericRoutes } = useRouterModule();
    let currentRoute: TAnyGenericRoute | null = exp(genericRoutes);

    while (currentRoute != null) {
        const { label } = currentRoute;

        if (label != null) {
            let partLabel: string;

            if (label[0] === ":") {
                // Replace the :... label with the url parameter value
                const urlParameterKey = label.slice(1);
                const urlParameterValue = params[urlParameterKey];

                if (urlParameterKey == null) {
                    throw new Error(
                        `No matching url parameter was found for the url parameter.`,
                    );
                }

                partLabel = urlParameterValue;
            } else {
                partLabel = label;
            }

            linkParts.push({ route: currentRoute, label: partLabel });
        }

        currentRoute = currentRoute.parent;
    }

    linkParts.reverse();

    return (
        <MixinButton
            options={{
                size: "mixin-button-sm",
                theme: "theme-button-generic-white",
            }}
            className="shrink-0 flex-wrap max-w-full"
            isStatic
            hasShadow
            type="button"
        >
            {linkParts.map(({ route, label }, i) => {
                const isLayout = isLayoutRoute(route);

                return (
                    <React.Fragment key={i}>
                        {!isLayout ? (
                            <RouterLink className="hover:underline max-w-[160px] truncate" exp={() => route} params={params}>
                                {label}
                            </RouterLink>
                        ) : (
                            <div className=" max-w-[160px] truncate">{label}</div>
                        )}
                        {i < linkParts.length - 1 && <div key={`divider-${i}`}>›</div>}
                    </React.Fragment>
                );
            })}
        </MixinButton>
    );
}
