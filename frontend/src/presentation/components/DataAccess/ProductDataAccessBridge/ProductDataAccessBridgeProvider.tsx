import { PropsWithChildren, useCallback } from "react";
import { IProductDataAccessBridge, ProductDataAccessBridgeContext } from "./ProductDataAccessBridgeProvider.Context";
import IProductDataAccess from "../../../interfaces/dataAccess/IProductDataAccess";
import useResponseHandler from "../../../hooks/useResponseHandler";
import { ok } from "neverthrow";
import PresentationErrorFactory from "../../../mappers/PresentationErrorFactory";

export default function ProductDataAccessBridgeProvider(props: PropsWithChildren<{ productDataAcess: IProductDataAccess }>) {
    const { children, productDataAcess } = props;
    const responseHandler = useResponseHandler();

    const create: IProductDataAccessBridge["create"] = useCallback(async (req, { onError, onSuccess }) => {
        await responseHandler({
            requestFn: () => productDataAcess.createProduct(req),
            onResponseFn: async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    onSuccess(data);
                } else {
                    const errors = await res.json();
                    onError(PresentationErrorFactory.ApiErrorsToPresentationErrors(errors));
                }

                return ok(undefined);
            },
        });
    }, [productDataAcess, responseHandler]);

    const update: IProductDataAccessBridge["update"] = useCallback(async (req, { onError, onSuccess }) => {
        await responseHandler({
            requestFn: () => productDataAcess.updateProduct(req),
            onResponseFn: async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    onSuccess(data);
                } else {
                    const errors = await res.json();
                    onError(PresentationErrorFactory.ApiErrorsToPresentationErrors(errors));
                }

                return ok(undefined);
            },
        });
    }, [productDataAcess, responseHandler]);

    const updateAmount: IProductDataAccessBridge["updateAmount"] = useCallback(async ({ id, dto }, { onError, onSuccess }) => {
        await responseHandler({
            requestFn: () => productDataAcess.updateProductAmount(id, dto),
            onResponseFn: async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    onSuccess(data);
                } else {
                    const errors = await res.json();
                    onError(PresentationErrorFactory.ApiErrorsToPresentationErrors(errors));
                }

                return ok(undefined);
            },
        });
    }, [productDataAcess, responseHandler]);

    const list: IProductDataAccessBridge["list"] = useCallback(async (req, { onError, onSuccess }) => {
        await responseHandler({
            requestFn: () => productDataAcess.listProducts(req),
            onResponseFn: async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    onSuccess(data);
                } else {
                    const errors = await res.json();
                    onError(PresentationErrorFactory.ApiErrorsToPresentationErrors(errors));
                }

                return ok(undefined);
            },
        });
    }, [productDataAcess, responseHandler]);

    const deleteProduct: IProductDataAccessBridge["delete"] = useCallback(async (req, { onError, onSuccess }) => {
        await responseHandler({
            requestFn: () => productDataAcess.deleteProduct(req),
            onResponseFn: async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    onSuccess(data);
                } else {
                    const errors = await res.json();
                    onError(PresentationErrorFactory.ApiErrorsToPresentationErrors(errors));
                }

                return ok(undefined);
            },
        });
    }, [productDataAcess, responseHandler]);

    return <ProductDataAccessBridgeContext.Provider value={{ create: create, update: update, updateAmount: updateAmount, list: list, delete: deleteProduct }}>{children}</ProductDataAccessBridgeContext.Provider>;
}
