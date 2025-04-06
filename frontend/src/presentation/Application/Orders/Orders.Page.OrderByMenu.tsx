import { useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import StatelessRadioCheckboxField from "../../components/StatelessFields/StatelessRadioCheckboxField";
import { useAbstractTooltipContext } from "../../components/AbtractTooltip/AbstractTooltip.Context";
import Divider from "../../components/Resuables/Divider";
import { PolymorphicAbstractTooltipDefaultPanel } from "../../components/renderAbstractTooltip/AbstractTooltip";
import { PolymorphicMixinPanelSection, PolymorphicMixinPanel } from "../../components/Resuables/MixinPanel";
import { useRouterNavigate } from "../../routes/RouterModule/RouterModule.hooks";

export default function OrderByMenu() {
    const { onClose } = useAbstractTooltipContext();
    const navigate = useRouterNavigate();
    const searchParams: Record<string, string> = useSearch({ strict: false });

    const orderBy = searchParams.orderBy;
    const onChange = useCallback(
        (value: string) => {
            navigate({ exp: (routes) => routes.LIST_ORDERS, params: {}, search: { ...searchParams, orderBy: value } });
            onClose();
        },
        [navigate, searchParams, onClose],
    );

    return (
        <PolymorphicAbstractTooltipDefaultPanel className="z-10 fixed mt-1">
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
                    <div className="text-sm">Total - Lowest to Highest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"total asc"} checked={orderBy === "total asc"} />
                </PolymorphicMixinPanelSection>
                <Divider />
                <PolymorphicMixinPanelSection className="flex flex-row gap-5 items-center justify-between">
                    <div className="text-sm">Total - Highest to Lowest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"total desc"} checked={orderBy === "total desc"} />
                </PolymorphicMixinPanelSection>
            </PolymorphicMixinPanel>
        </PolymorphicAbstractTooltipDefaultPanel>
    );
}
