import { useMutation } from "@tanstack/react-query";
import IProduct from "../../../../domain/models/IProduct";
import useItemManager from "../../../hooks/useItemManager";
import IPresentationError from "../../../interfaces/IPresentationError";
import DeleteProductDialogPanel from "./DeleteProduct.DialogPanel";
import { useRouterNavigate } from "../../../routes/RouterModule/RouterModule.hooks";
import { useProductDataAccessBridgeContext } from "../../../components/DataAccess/ProductDataAccessBridge/ProductDataAccessBridgeProvider.Context";

export type DeleteProductErrorSchema = IPresentationError<unknown>;

export default function DeleteProductController(props: { product: IProduct; onClose: () => void }) {
    // Data
    const { product, onClose } = props;

    // Deps
    const navigate = useRouterNavigate();
    const productDataAccessBridge = useProductDataAccessBridgeContext();

    // State
    const errorManager = useItemManager<DeleteProductErrorSchema>({});

    // Callbacks
    const deleteProductMutation = useMutation({
        mutationFn: async () => {
            await productDataAccessBridge.delete({ id: product.id }, {
                onError: errorManager.setAll,
                onSuccess: () => {
                    navigate({ exp: (routes) => routes.LIST_PRODUCTS, params: {} })
                    onClose();
                }
            })
        },
    });

    return (
        <DeleteProductDialogPanel
            product={product}
            onSubmit={deleteProductMutation.mutate}
            errors={errorManager.items}
            onClose={() => {
                errorManager.setAll({});
                onClose();
            }}
        />
    );
}
