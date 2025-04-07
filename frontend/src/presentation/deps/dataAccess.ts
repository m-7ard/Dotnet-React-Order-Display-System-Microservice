import DraftImageDataAccess from "../../infrastructure/dataAccess/DraftImageDataAccess";
import OrderDataAccess from "../../infrastructure/dataAccess/OrderDataAccess";
import ProductDataAccess from "../../infrastructure/dataAccess/ProductDataAccess";
import ProductHistoryDataAccess from "../../infrastructure/dataAccess/ProductHistoryDataAccess";
import UserDataAccess from "../../infrastructure/dataAccess/UserDataAccess";

export const productDataAccess = new ProductDataAccess();
export const orderDataAccess = new OrderDataAccess();
export const draftImageDataAccess = new DraftImageDataAccess();
export const productHistoryDataAccess = new ProductHistoryDataAccess();
export const userDataAccess = new UserDataAccess();
