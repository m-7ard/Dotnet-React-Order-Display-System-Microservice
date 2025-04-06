import DraftImageDataAccess from "../../infrastructure/dataAccess/DraftImageDataAccess";
import OrderDataAccess from "../../infrastructure/dataAccess/OrderDataAccess";
import ProductDataAccess from "../../infrastructure/dataAccess/productDataAccess";
import ProductHistoryDataAccess from "../../infrastructure/dataAccess/ProductHistoryDataAccess";

export const productDataAccess = new ProductDataAccess();
export const orderDataAccess = new OrderDataAccess();
export const draftImageDataAccess = new DraftImageDataAccess();
export const productHistoryDataAccess = new ProductHistoryDataAccess();
