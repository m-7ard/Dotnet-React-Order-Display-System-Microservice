import { useMutation } from "@tanstack/react-query";
import IPresentationError from "../../../interfaces/IPresentationError";
import useItemManager from "../../../hooks/useItemManager";
import { Type } from "@sinclair/typebox";
import typeboxToDomainCompatibleFormError from "../../../mappers/typeboxToDomainCompatibleFormError";
import validateTypeboxSchema from "../../../utils/validateTypeboxSchema";
import CreateOrderPage from "./CreateOrder.Page";
import IProduct from "../../../../domain/models/IProduct";
import ICreateOrderRequestDTO from "../../../../infrastructure/contracts/orders/create/ICreateOrderRequestDTO";
import { useRouterNavigate } from "../../../routes/RouterModule/RouterModule.hooks";
import { useOrderDataAccessBridgeContext } from "../../../components/DataAccess/OrderDataAccessBridge/OrderDataAccessBridge";

const validatorSchema = Type.Object({
    orderItemData: Type.Record(
        Type.String({ minLength: 1 }),
        Type.Object({
            productId: Type.String({ minLength: 1 }),
            quantity: Type.Number({ minimum: 1 }),
        }),
        { minProperties: 1, suffixPath: "/_" },
    ),
});

export interface ValueSchema {
    orderItemData: {
        [productId: number | string]: {
            product: IProduct;
            quantity: number;
        };
    };
}

export type ErrorState = IPresentationError<{
    orderItemData: {
        [productId: number | string]: string[];
    };
}>;

const initialValues: ValueSchema = {
    orderItemData: {},
};

const initialErrors: ErrorState = {};

export default function CreateOrderController() {
    // Data
    const itemManager = useItemManager<ValueSchema>(initialValues);
    const errorManager = useItemManager<ErrorState>(initialErrors);

    // Deps
    const navigate = useRouterNavigate();
    const orderDataAccessBridge = useOrderDataAccessBridgeContext();

    // Callbacks
    const createOrderMutation = useMutation({
        mutationFn: async () => {
            const request: ICreateOrderRequestDTO = {
                ...itemManager.items,
                orderItemData: Object.entries(itemManager.items.orderItemData).reduce<ICreateOrderRequestDTO["orderItemData"]>((acc, [key, value]) => {
                    acc[key] = {
                        productId: value.product.id,
                        quantity: value.quantity,
                    };

                    return acc;
                }, {}),
            };

            const validation = validateTypeboxSchema(validatorSchema, request);

            if (validation.isErr()) {
            const errors = typeboxToDomainCompatibleFormError<ErrorState>(validation.error);
                errorManager.setAll(errors);
                return;
            }

            await orderDataAccessBridge.create(request, {
                onSuccess: () => navigate({ exp: (routes) => routes.LIST_ORDERS, params: {} }),
                onError: errorManager.setAll
            })
        },
    });

    return (
        <CreateOrderPage
            onSubmit={createOrderMutation.mutate}
            onReset={() => {
                itemManager.setAll(initialValues);
                errorManager.setAll(initialErrors);
            }}
            onChange={(value) => {
                itemManager.setAll(value);
            }}
            errors={errorManager.items}
            value={itemManager.items}
        />
    );
}
