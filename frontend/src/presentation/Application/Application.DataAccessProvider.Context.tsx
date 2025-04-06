import IDraftImageDataAccess from "../interfaces/dataAccess/IDraftImageDataAccess";
import IOrderDataAccess from "../interfaces/dataAccess/IOrderDataAccess";
import IProductDataAccess from "../interfaces/dataAccess/IProductDataAccess";
import IProductHistoryDataAccess from "../interfaces/dataAccess/IProductHistoryDataAccess";
import createSafeContext from "../utils/createSafeContext";

export const [DataAccessContext, useDataAccessContext] = createSafeContext<{
    productDataAccess: IProductDataAccess;
    productHistoryDataAccess: IProductHistoryDataAccess;
    orderDataAccess: IOrderDataAccess;
    draftImageDataAccess: IDraftImageDataAccess;
}>("useDataAccessContext must be used within DataAccessContext.Provider");