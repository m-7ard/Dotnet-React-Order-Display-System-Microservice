import { useSearch } from "@tanstack/react-router";
import useItemManager from "../../../hooks/useItemManager";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialog.Panel.Context";
import { FilterProductHistoriesFieldsetValueState } from "../../../components/Fieldsets/FilterProductHistoriesFieldset";
import FilterProductHistoriesDialogPanel from "./FilterProductHistories.DialogPanel";
import { useRouterNavigate } from "../../../routes/RouterModule/RouterModule.hooks";

export type ValueSchema = { [K in keyof FilterProductHistoriesFieldsetValueState]?: FilterProductHistoriesFieldsetValueState[K] };

const clearedValue: ValueSchema = {
    name: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    description: undefined,
    validTo: undefined,
    validFrom: undefined,
    productId: undefined,
};

export default function FilterProductHistoriesController() {
    const searchParams: Partial<Record<string, string>> = useSearch({ strict: false });
    const initialValue = {
        name: searchParams.name,
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        description: searchParams.description,
        validTo: searchParams.validTo,
        validFrom: searchParams.validFrom,
        productId: searchParams.productId,
    };
    const { onClose } = useGlobalDialogPanelContext();
    const itemManager = useItemManager<ValueSchema>(initialValue);
    const navigate = useRouterNavigate();

    const fromRequiredToPartial = (value: Required<ValueSchema>) => {
        const entries = Object.entries(value).map(([key, val]) => [key, val === "" ? undefined : val]);
        return Object.fromEntries(entries);
    };

    const fromPartialToRequired = (value: Partial<ValueSchema>): Required<ValueSchema> => {
        const entries = Object.entries(value).map(([key, val]) => [key, val ?? ""]);
        return Object.fromEntries(entries);
    };

    return (
        <FilterProductHistoriesDialogPanel
            value={fromPartialToRequired(itemManager.items)}
            onClose={onClose}
            onSubmit={() => {
                navigate({ exp: (routes) => routes.LIST_PRODUCT_HISTORIES, params: {}, search: itemManager.items });
                onClose();
            }}
            onReset={() => itemManager.setAll(initialValue)}
            onChange={(value) => itemManager.setAll(fromRequiredToPartial(value))}
            onClear={() => itemManager.setAll(clearedValue)}
        />
    );
}
