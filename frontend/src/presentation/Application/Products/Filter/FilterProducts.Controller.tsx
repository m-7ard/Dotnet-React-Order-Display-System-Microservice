import { useSearch } from "@tanstack/react-router";
import useItemManager from "../../../hooks/useItemManager";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialog.Panel.Context";
import { FilterProductsFieldsetValueState } from "../../../components/Fieldsets/FilterProductFieldset";
import FilterProductsDialogPanel from "./FilterProducts.DialogPanel";
import { useRouterNavigate } from "../../../routes/RouterModule/RouterModule.hooks";

export type ValueSchema = { [K in keyof FilterProductsFieldsetValueState]?: FilterProductsFieldsetValueState[K] };

const clearedValue: ValueSchema = {
    id: undefined,
    name: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    description: undefined,
    createdBefore: undefined,
    createdAfter: undefined,
};

export default function FilterProductsController() {
    const { onClose } = useGlobalDialogPanelContext();
    const searchParams: Partial<Record<string, string>> = useSearch({ strict: false });
    const initialValue = {
        id: searchParams.id,
        name: searchParams.name,
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        description: searchParams.description,
        createdBefore: searchParams.createdBefore,
        createdAfter: searchParams.createdAfter,
    };
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
        <FilterProductsDialogPanel
            value={fromPartialToRequired(itemManager.items)}
            onClose={onClose}
            onSubmit={() => {
                navigate({ exp: (routes) => routes.LIST_PRODUCTS, params: {}, search: itemManager.items });
                onClose();
            }}
            onReset={() => itemManager.setAll(initialValue)}
            onChange={(value) => itemManager.setAll(fromRequiredToPartial(value))}
            onClear={() => itemManager.setAll(clearedValue)}
        />
    );
}
