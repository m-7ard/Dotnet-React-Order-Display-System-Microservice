import DraftImageDataAccess from "../../infrastructure/dataAccess/DraftImageDataAccess";
import OrderDataAccess from "../../infrastructure/dataAccess/OrderDataAccess";
import ProductDataAccess from "../../infrastructure/dataAccess/ProductDataAccess";
import ProductHistoryDataAccess from "../../infrastructure/dataAccess/ProductHistoryDataAccess";
import UserDataAccess from "../../infrastructure/dataAccess/UserDataAccess";
import tokenStorage from "./tokenStorage";

export const productDataAccess = new ProductDataAccess(tokenStorage);
export const orderDataAccess = new OrderDataAccess(tokenStorage);
export const draftImageDataAccess = new DraftImageDataAccess(tokenStorage);
export const productHistoryDataAccess = new ProductHistoryDataAccess(tokenStorage);
export const userDataAccess = new UserDataAccess(tokenStorage);
