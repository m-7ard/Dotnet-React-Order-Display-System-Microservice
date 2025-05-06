import { PropsWithChildren, useCallback } from "react";
import { IOrderDataAccessBridge, OrderDataAccessBridge } from "./OrderDataAccessBridge";
import useResponseHandler from "../../../hooks/useResponseHandler";
import { ok } from "neverthrow";
import PresentationErrorFactory from "../../../mappers/PresentationErrorFactory";
import IOrderDataAccess from "../../../interfaces/dataAccess/IOrderDataAccess";

export default function OrderDataAccessBridgeProvider(props: PropsWithChildren<{ orderDataAccess: IOrderDataAccess }>) {
    const { children, orderDataAccess } = props;
    const responseHandler = useResponseHandler();

    const create: IOrderDataAccessBridge["create"] = useCallback(async (req, { onError, onSuccess }) => {
        await responseHandler({
            requestFn: () => orderDataAccess.createOrder(req),
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
    }, [orderDataAccess, responseHandler]);

    const markOrderFinished: IOrderDataAccessBridge["markOrderFinished"] = useCallback(async (req, { onError, onSuccess }) => {
        await responseHandler({
            requestFn: () => orderDataAccess.markOrderFinished(req),
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
    }, [orderDataAccess, responseHandler]);

    const markOrderItemFinished: IOrderDataAccessBridge["markOrderItemFinished"] = useCallback(async (req, { onError, onSuccess }) => {
        await responseHandler({
            requestFn: () => orderDataAccess.markOrderItemFinished(req),
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
    }, [orderDataAccess, responseHandler]);

    return <OrderDataAccessBridge.Provider value={{ create: create, markOrderFinished: markOrderFinished, markOrderItemFinished: markOrderItemFinished }}>{children}</OrderDataAccessBridge.Provider>;
}
