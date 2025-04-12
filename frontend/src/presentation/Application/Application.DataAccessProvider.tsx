import { PropsWithChildren } from "react";
import { DataAccessContext } from "./Application.DataAccessProvider.Context";
import { draftImageDataAccess, orderDataAccess, productDataAccess, productHistoryDataAccess, userDataAccess } from "../deps/dataAccess";
import tokenStorage from "../deps/tokenStorage";

export default function DataAccessProvider(props: PropsWithChildren) {
    const { children } = props;

    return (
        <DataAccessContext.Provider
            value={{
                productDataAccess: productDataAccess,
                productHistoryDataAccess: productHistoryDataAccess,
                orderDataAccess: orderDataAccess,
                draftImageDataAccess: draftImageDataAccess,
                userDataAccess: userDataAccess,
                tokenStorage: tokenStorage
            }}
        >
            {children}
        </DataAccessContext.Provider>
    );
}
