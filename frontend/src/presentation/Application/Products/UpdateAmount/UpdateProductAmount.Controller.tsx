import { Type } from "@sinclair/typebox";
import IPresentationError from "../../../interfaces/IPresentationError";
import useItemManager from "../../../hooks/useItemManager";
import { useMutation } from "@tanstack/react-query";
import typeboxToDomainCompatibleFormError from "../../../mappers/typeboxToDomainCompatibleFormError";
import validateTypeboxSchema from "../../../utils/validateTypeboxSchema";
import { useRouterLoaderData, useRouterNavigate } from "../../../routes/RouterModule/RouterModule.hooks";
import UpdateProductAmountPage from "./UpdateProductAmount.Page";
import { useProductDataAccessBridgeContext } from "../../../components/DataAccess/ProductDataAccessBridge/ProductDataAccessBridgeProvider.Context";

const validatorSchema = Type.Object({
    amount: Type.Number({
        minimum: 0,
        maximum: 10 ** 6,
    }),
});

export interface ValueSchema {
    amount: string;
}

export type ErrorSchema = IPresentationError<{
    amount: string[];
}>;

const initialErrorState: ErrorSchema = {};

export default function UpdateProductAmountController() {
    // Data
    const { product } = useRouterLoaderData((keys) => keys.UPDATE_PRODUCT_AMOUNT);
    const initialValueState: ValueSchema = {
        amount: product.amount.toString(),
    };

    // Deps
    const navigate = useRouterNavigate();
    const productDataAccessBridge = useProductDataAccessBridgeContext();

    // State
    const itemManager = useItemManager<ValueSchema>(initialValueState);
    const errorManager = useItemManager<ErrorSchema>(initialErrorState);

    // Callbacks
    const updateProductMutation = useMutation({
        mutationFn: async () => {
            const validation = validateTypeboxSchema(validatorSchema, {
                amount: parseFloat(itemManager.items.amount),
            });

            if (validation.isErr()) {
                const errors = typeboxToDomainCompatibleFormError(validation.error);
                errorManager.setAll(errors);
                return;
            }

            const data = validation.value;
            await productDataAccessBridge.updateAmount(
                {
                    id: product.id,
                    dto: {
                        amount: data.amount,
                    },
                },
                {
                    onError: errorManager.setAll,
                    onSuccess: () => navigate({ exp: (routes) => routes.LIST_PRODUCTS, params: {} }),
                },
            );
        },
    });

    return product == null ? null : (
        <UpdateProductAmountPage
            value={itemManager.items}
            errors={errorManager.items}
            onChange={itemManager.setAll}
            onReset={() => itemManager.setAll(initialValueState)}
            onSubmit={() => updateProductMutation.mutate()}
            product={product}
        />
    );
}
