import { TokenStorage } from "../deps/tokenStorage";
import IDraftImageDataAccess from "../interfaces/dataAccess/IDraftImageDataAccess";
import IOrderDataAccess from "../interfaces/dataAccess/IOrderDataAccess";
import IProductDataAccess from "../interfaces/dataAccess/IProductDataAccess";
import IProductHistoryDataAccess from "../interfaces/dataAccess/IProductHistoryDataAccess";
import IUserDataAccess from "../interfaces/dataAccess/IUserDataAccess";
import createSafeContext from "../utils/createSafeContext";

export const [DataAccessContext, useDataAccessContext] = createSafeContext<{
    productDataAccess: IProductDataAccess;
    productHistoryDataAccess: IProductHistoryDataAccess;
    orderDataAccess: IOrderDataAccess;
    draftImageDataAccess: IDraftImageDataAccess;
    userDataAccess: IUserDataAccess;
    tokenStorage: TokenStorage
}>("useDataAccessContext must be used within DataAccessContext.Provider");