import { useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import StatelessRadioCheckboxField from "../../components/StatelessFields/StatelessRadioCheckboxField";
import { useAbstractTooltipContext } from "../../components/renderAbstractTooltip/AbstractTooltip.Context";
import Divider from "../../components/Resuables/Divider";
import { PolymorphicAbstractTooltipDefaultPanel } from "../../components/renderAbstractTooltip/AbstractTooltip";
import { PolymorphicMixinPanel, PolymorphicMixinPanelSection } from "../../components/Resuables/MixinPanel";
import { useRouterNavigate } from "../../routes/RouterModule/RouterModule.hooks";

export default function OrderByMenu() {
    const { onClose } = useAbstractTooltipContext();
    const navigate = useRouterNavigate();
    const searchParams: Record<string, string> = useSearch({ strict: false });

    const orderBy = searchParams.orderBy;
    const onChange = useCallback(
        (value: string) => {
            navigate({ exp: (routes) => routes.LIST_PRODUCT_HISTORIES, params: {}, search: { ...searchParams, orderBy: value } });
            onClose();
        },
        [navigate, searchParams, onClose],
    );

    return (
        <PolymorphicAbstractTooltipDefaultPanel className={`z-10 fixed mt-1`}>
            <PolymorphicMixinPanel exp={(options) => ({ hasBorder: true, hasShadow: true, size: options.SIZE.BASE, theme: options.THEMES.GENERIC_WHITE })}>
                <PolymorphicMixinPanelSection className="flex flex-row gap-5 items-center justify-between">
                    <div className="text-sm">Newest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"newest"} checked={orderBy === "newest"} />
                </PolymorphicMixinPanelSection>
                <Divider />
                <PolymorphicMixinPanelSection className="flex flex-row gap-5 items-center justify-between">
                    <div className="text-sm">Oldest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"oldest"} checked={orderBy === "oldest"} />
                </PolymorphicMixinPanelSection>
                <Divider />
                <PolymorphicMixinPanelSection className="flex flex-row gap-5 items-center justify-between">
                    <div className="text-sm">Price - Highest to Lowest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"price desc"} checked={orderBy === "price desc"} />
                </PolymorphicMixinPanelSection>
                <Divider />
                <PolymorphicMixinPanelSection className="flex flex-row gap-5 items-center justify-between">
                    <div className="text-sm">Price - Lowest to Highest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"price asc"} checked={orderBy === "price asc"} />
                </PolymorphicMixinPanelSection>
            </PolymorphicMixinPanel>
        </PolymorphicAbstractTooltipDefaultPanel>
    );
}
