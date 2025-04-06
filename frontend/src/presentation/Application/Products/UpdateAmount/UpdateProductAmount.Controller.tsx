import { Type } from "@sinclair/typebox";
import IPresentationError from "../../../interfaces/IPresentationError";
import useItemManager from "../../../hooks/useItemManager";
import { useMutation } from "@tanstack/react-query";
import typeboxToDomainCompatibleFormError from "../../../mappers/typeboxToDomainCompatibleFormError";
import validateTypeboxSchema from "../../../utils/validateTypeboxSchema";
import useResponseHandler from "../../../hooks/useResponseHandler";
import { productDataAccess } from "../../../deps/dataAccess";
import { err, ok } from "neverthrow";
import PresentationErrorFactory from "../../../mappers/PresentationErrorFactory";
import { useRouterLoaderData, useRouterNavigate } from "../../../routes/RouterModule/RouterModule.hooks";
import UpdateProductAmountPage from "./UpdateProductAmount.Page";

const validatorSchema = Type.Object({
    amount: Type.Number({
        minimum: 0,
        maximum: 10 ** 6,
    })
});

export interface ValueSchema {
    amount: string;
}

export type ErrorSchema = IPresentationError<{
    amount: string[];
}>;

const initialErrorState: ErrorSchema = {};

export default function UpdateProductAmountController() {
    const { product } = useRouterLoaderData((keys) => keys.UPDATE_PRODUCT_AMOUNT);

    const responseHandler = useResponseHandler();
    const initialValueState: ValueSchema = {
        amount: product.amount.toString()
    };

    const itemManager = useItemManager<ValueSchema>(initialValueState);
    const errorManager = useItemManager<ErrorSchema>(initialErrorState);

    const navigate = useRouterNavigate();
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

            await responseHandler({
                requestFn: () =>
                    productDataAccess.updateProductAmount(product.id, {
                        amount: data.amount
                    }),
                onResponseFn: async (response) => {
                    if (response.ok) {
                        navigate({ exp: (routes) => routes.LIST_PRODUCTS, params: {} });
                        return ok(undefined);
                    } else if (response.status === 400) {
                        const errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(await response.json());
                        errorManager.setAll(errors);
                        return ok(undefined);
                    }

                    return err(undefined);
                },
            });
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
