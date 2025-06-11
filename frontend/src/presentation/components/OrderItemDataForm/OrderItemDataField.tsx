import IPresentationError from "../../interfaces/IPresentationError";
import MixinButton from "../Resuables/MixinButton/MixinButton";
import OrderItemDataFieldItem, { ValueSchema as OrderItemDataValueSchema } from "./OrderItemDataField.Item";
import GlobalDialog from "../Dialog/GlobalDialog";
import IProduct from "../../../domain/models/IProduct";
import { useCallback } from "react";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";
import CountTrackerProduct from "../FilterProductResults/FilterProductResults.Pages.Results.CountTracker";
import FilterProductResultsControllerV2 from "../FilterProductResults/FilterProductResults.Controller.V2";

type ErrorSchema = IPresentationError<{
    [productId: number | string]: string[];
}>;

type ValueSchema = {
    [productId: number | string]: OrderItemDataValueSchema;
};

export interface IOrderItemDataFieldProps {
    onChange: (value: ValueSchema) => void;
    errors?: ErrorSchema;
    value: ValueSchema;
    "aria-describedby"?: string;
    id?: string;
}

export default function OrderItemDataField(props: IOrderItemDataFieldProps) {
    const { errors, value, onChange, "aria-describedby": describedBy, id } = props;

    const deleteOrderItem = useCallback(
        (productId: number | string) => {
            const newValue = { ...value };
            delete newValue[productId];
            onChange(newValue);
        },
        [onChange, value],
    );

    const addOrderItem = useCallback(
        (product: IProduct) => {
            const newValue = { ...value };
            newValue[product.id] = {
                product: product,
                quantity: 1,
            };
            onChange(newValue);
        },
        [onChange, value],
    );

    const updateOrderItem = useCallback(
        (orderItemData: OrderItemDataValueSchema) => {
            const newValue = { ...value };
            newValue[orderItemData.product.id] = orderItemData;
            onChange(newValue);
        },
        [onChange, value],
    );

    const hasItems = Object.entries(value).length > 0;
    const itemCount = Object.entries(value).length;

    return (
        <div role="group" aria-label={"Order items"} aria-describedby={describedBy}>
            {/* Hidden input for FormField label association */}
            <input type="hidden" id={id} value={JSON.stringify(value)} readOnly aria-hidden="true" />
            <MixinPrototypeCard
                options={{
                    size: "mixin-Pcard-base",
                    theme: "theme-Pcard-generic-white",
                }}
                hasBorder
                hasDivide
            >
                <MixinPrototypeCardSection>
                    <GlobalDialog
                        zIndex={10}
                        Trigger={({ onToggle }) => (
                            <MixinButton
                                options={{
                                    size: "mixin-button-base",
                                    theme: "theme-button-generic-white",
                                }}
                                className="w-full justify-center"
                                onClick={onToggle}
                                type="button"
                                aria-label="Add products to order"
                                aria-describedby={hasItems ? undefined : "empty-order-hint"}
                            >
                                Add Products
                            </MixinButton>
                        )}
                        Panel={FilterProductResultsControllerV2<typeof CountTrackerProduct>}
                        panelProps={{
                            renderAs: "panel",
                            ResultElement: CountTrackerProduct,
                            propsFactory: (product) => {
                                const orderItemData = value[product.id];
                                return {
                                    product: product,
                                    onAdd: () => addOrderItem(product),
                                    quantity: orderItemData?.quantity ?? null,
                                };
                            },
                        }}
                    />
                    {!hasItems && (
                        <p id="empty-order-hint" className="text-sm text-gray-600 mt-2 text-center">
                            No items added yet. Click "Add Products" to get started.
                        </p>
                    )}
                </MixinPrototypeCardSection>

                {hasItems && (
                    <MixinPrototypeCardSection
                        className="grid grid-cols-2 max-[576px]:grid-cols-2 max-[445px]:grid-cols-1 gap-3"
                        role="list"
                        aria-label={`Order items (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
                    >
                        {Object.entries(value).map(([productId, oiData], index) => (
                            <div key={productId} role="listitem" aria-label={`Item ${index + 1} of ${itemCount}: ${oiData.product.name}`}>
                                <OrderItemDataFieldItem
                                    product={oiData.product}
                                    errors={{
                                        _: errors?.[productId],
                                    }}
                                    value={value[productId]}
                                    onUpdate={updateOrderItem}
                                    onDelete={() => deleteOrderItem(productId)}
                                />
                            </div>
                        ))}
                    </MixinPrototypeCardSection>
                )}

                {/* Screen reader summary */}
                <div className="sr-only" aria-live="polite" aria-atomic="true">
                    {hasItems ? `Order contains ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Order is empty"}
                </div>
            </MixinPrototypeCard>
        </div>
    );
}
