import { useSearch } from "@tanstack/react-router";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialog.Panel.Context";
import { FilterOrdersFieldsetValueState } from "../../../components/Fieldsets/FilterOrdersFieldset";
import useItemManager from "../../../hooks/useItemManager";
import FilterOrdersDialogPanel from "./FilterOrders.DialogPanel";
import { useRouterNavigate } from "../../../routes/RouterModule/RouterModule.hooks";

export type ValueSchema = { [K in keyof FilterOrdersFieldsetValueState]?: FilterOrdersFieldsetValueState[K] };

const clearedValue: ValueSchema = {
    id: undefined,
    minTotal: undefined,
    maxTotal: undefined,
    status: undefined,
    createdBefore: undefined,
    createdAfter: undefined,
    productId: undefined,
    productHistoryId: undefined,
    orderSerialNumber: undefined,
    orderItemSerialNumber: undefined,
};

export default function FilterOrdersController() {
    const { onClose } = useGlobalDialogPanelContext();
    const searchParams: Partial<Record<string, string>> = useSearch({ strict: false });
    const initialValue: ValueSchema = {
        id: searchParams.id,
        minTotal: searchParams.minTotal,
        maxTotal: searchParams.maxTotal,
        status: searchParams.status,
        createdBefore: searchParams.createdBefore,
        createdAfter: searchParams.createdAfter,
        productId: searchParams.productId,
        productHistoryId: searchParams.productHistoryId,
        orderSerialNumber: searchParams.orderSerialNumber,
        orderItemSerialNumber: searchParams.orderItemSerialNumber,
    };
    const itemManager = useItemManager<ValueSchema>(initialValue);
    const navigate = useRouterNavigate();

    const fromRequiredToPartial = (value: Required<ValueSchema>): Partial<ValueSchema> => {
        const entries = Object.entries(value).map(([key, val]) => [key, val === "" ? undefined : val]);
        return Object.fromEntries(entries);
    };

    const fromPartialToRequired = (value: Partial<ValueSchema>): Required<ValueSchema> => {
        const entries = Object.entries(value).map(([key, val]) => [key, val ?? ""]);
        return Object.fromEntries(entries);
    };

    return (
        <FilterOrdersDialogPanel
            value={fromPartialToRequired(itemManager.items)}
            onClose={onClose}
            onSubmit={() => {
                navigate({ exp: (routes) => routes.LIST_ORDERS, params: {}, search: itemManager.items });
                onClose();
            }}
            onReset={() => itemManager.setAll(initialValue)}
            onChange={(value) => itemManager.setAll(fromRequiredToPartial(value))}
            onClear={() => itemManager.setAll(clearedValue)}
        />
    );
}
