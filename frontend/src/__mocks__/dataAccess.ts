import IDraftImageDataAccess from "../presentation/interfaces/dataAccess/IDraftImageDataAccess";
import IOrderDataAccess from "../presentation/interfaces/dataAccess/IOrderDataAccess";
import IProductDataAccess from "../presentation/interfaces/dataAccess/IProductDataAccess";
import IProductHistoryDataAccess from "../presentation/interfaces/dataAccess/IProductHistoryDataAccess";

export const mockProductDataAccess: jest.Mocked<IProductDataAccess> = {
    createProduct: jest.fn(),
    listProducts: jest.fn(),
    readProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    updateProductAmount: jest.fn(),
};

export const mockOrderDataAccess: jest.Mocked<IOrderDataAccess> = {
    listOrders: jest.fn(),
    createOrder: jest.fn(),
    markOrderItemFinished: jest.fn(),
    markOrderFinished: jest.fn(),
    readOrder: jest.fn(),
};

export const mockProductHistoryDataAccess: jest.Mocked<IProductHistoryDataAccess> = {
    listProductHistories: jest.fn(),
};

export const mockDraftImageDataAccess: jest.Mocked<IDraftImageDataAccess> = {
    uploadImages: jest.fn(),
};