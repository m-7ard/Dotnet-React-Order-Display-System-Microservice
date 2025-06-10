import { useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import { useAbstractTooltipContext } from "../../components/renderAbstractTooltip/AbstractTooltip.Context";
import { PolymorphicAbstractTooltipDefaultPanel } from "../../components/renderAbstractTooltip/AbstractTooltip";
import { useRouterNavigate } from "../../routes/RouterModule/RouterModule.hooks";
import RadioButtonMenu from "../../components/Resuables/RadioButtonMenu";

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

    const options = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "price asc", label: "Price - Lowest to Highest" },
        { value: "price desc", label: "Price - Highest to Lowest" },
    ];

    return (
        <PolymorphicAbstractTooltipDefaultPanel className={`z-10 fixed mt-1`}>
            <RadioButtonMenu
                name="orderBy"
                screenReaderDescription="Choose how to sort the product history list. Selection will apply immediately."
                options={options}
                rulingValue={orderBy}
                onChange={onChange}
                onClose={onClose}
            />
        </PolymorphicAbstractTooltipDefaultPanel>
    );
}
