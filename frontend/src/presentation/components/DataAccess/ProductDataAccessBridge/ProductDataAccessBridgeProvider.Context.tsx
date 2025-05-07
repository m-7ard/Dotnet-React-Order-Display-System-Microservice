import ICreateProductRequestDTO from "../../../../infrastructure/contracts/products/create/ICreateProductRequestDTO";
import createSafeContext from "../../../utils/createSafeContext";
import ICreateProductRespnseDTO from "../../../../infrastructure/contracts/products/create/ICreateProductResponseDTO";
import TDataAccessFn from "../TDataAccessFn";
import IUpdateProductRequestDTO from "../../../../infrastructure/contracts/products/update/IUpdateProductRequestDTO";
import IUpdateProductRespnseDTO from "../../../../infrastructure/contracts/products/update/IUpdateProductRespnseDTO";
import IUpdateProductAmountRequestDTO from "../../../../infrastructure/contracts/products/updateAmount/IUpdateProductAmountRequestDTO";
import IUpdateProductAmountResponseDTO from "../../../../infrastructure/contracts/products/updateAmount/IUpdateProductAmountResponseDTO";
import IListProductsRequestDTO from "../../../../infrastructure/contracts/products/list/IListProductsRequestDTO";
import IListProductsResponseDTO from "../../../../infrastructure/contracts/products/list/IListProductsResponseDTO";
import IDeleteProductRequestDTO from "../../../../infrastructure/contracts/products/delete/IDeleteProductRequestDTO";
import IDeleteProductRespnseDTO from "../../../../infrastructure/contracts/products/delete/IDeleteProductRespnseDTO";

export interface IProductDataAccessBridge {
    create: TDataAccessFn<ICreateProductRequestDTO, ICreateProductRespnseDTO>;
    update: TDataAccessFn<IUpdateProductRequestDTO, IUpdateProductRespnseDTO>;
    updateAmount: TDataAccessFn<{ id: string; dto: IUpdateProductAmountRequestDTO }, IUpdateProductAmountResponseDTO>;
    list: TDataAccessFn<IListProductsRequestDTO, IListProductsResponseDTO>;
    delete: TDataAccessFn<IDeleteProductRequestDTO, IDeleteProductRespnseDTO>;
}

export const [ProductDataAccessBridgeContext, useProductDataAccessBridgeContext] = createSafeContext<IProductDataAccessBridge>(
    "useProductDataAccessBridgeContext must be used within ProductDataAccessBridgeContext.Provider",
);
