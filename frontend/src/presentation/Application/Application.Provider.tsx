import { PropsWithChildren } from "react";
import ExceptionProvider from "./Application.ExceptionProvider";
import GlobalDialogManager from "../components/Dialog/GlobalDialog.Manager";
import { useLocation } from "@tanstack/react-router";
import DataAccessProvider from "./Application.DataAccessProvider";
import AuthServiceProvider from "./Application.AuthServiceProvider";
import EventServiceProvider from "./Application.EventServiceProvider";
import ProductDataAccessBridgeProvider from "../components/DataAccess/ProductDataAccessBridge/ProductDataAccessBridgeProvider";
import { orderDataAccess, productDataAccess, userDataAccess } from "../deps/dataAccess";
import OrderDataAccessBridgeProvider from "../components/DataAccess/OrderDataAccessBridge/OrderDataAccessBridgeProvider";
import tokenStorage from "../deps/tokenStorage";

export default function ApplicationProvider({ children }: PropsWithChildren) {
    const location = useLocation();

    return (
        <ExceptionProvider>
            <DataAccessProvider>
                <ProductDataAccessBridgeProvider productDataAcess={productDataAccess}>
                    <OrderDataAccessBridgeProvider orderDataAccess={orderDataAccess}>
                        <AuthServiceProvider href={location.href} userDataAccess={userDataAccess} tokenStorage={tokenStorage}>
                            <EventServiceProvider>
                                <GlobalDialogManager href={location.href}>{children}</GlobalDialogManager>
                            </EventServiceProvider>
                        </AuthServiceProvider>
                    </OrderDataAccessBridgeProvider>
                </ProductDataAccessBridgeProvider>
            </DataAccessProvider>
        </ExceptionProvider>
    );
}
