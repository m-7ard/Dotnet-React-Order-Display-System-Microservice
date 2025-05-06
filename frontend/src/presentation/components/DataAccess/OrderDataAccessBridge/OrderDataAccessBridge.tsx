import IMarkOrderItemFinishedRequestDTO from "../../../../infrastructure/contracts/orderItems/markFinished/IMarkOrderItemFinishedRequestDTO";
import IMarkOrderItemFinishedResponseDTO from "../../../../infrastructure/contracts/orderItems/markFinished/IMarkOrderItemFinishedResponseDTO";
import ICreateOrderRequestDTO from "../../../../infrastructure/contracts/orders/create/ICreateOrderRequestDTO";
import IMarkOrderFinishedRequestDTO from "../../../../infrastructure/contracts/orders/markFinished/IMarkOrderFinishedRequestDTO";
import IMarkOrderFinishedResponseDTO from "../../../../infrastructure/contracts/orders/markFinished/IMarkOrderFinishedResponseDTO";
import createSafeContext from "../../../utils/createSafeContext";
import TDataAccessFn from "../TDataAccessFn";

export interface IOrderDataAccessBridge {
    create: TDataAccessFn<ICreateOrderRequestDTO, ICreateOrderRequestDTO>;
    markOrderItemFinished: TDataAccessFn<IMarkOrderItemFinishedRequestDTO, IMarkOrderItemFinishedResponseDTO>;
    markOrderFinished: TDataAccessFn<IMarkOrderFinishedRequestDTO, IMarkOrderFinishedResponseDTO>;
}

export const [OrderDataAccessBridge, useOrderDataAccessBridgeContext] = createSafeContext<IOrderDataAccessBridge>("useOrderDataAccessBridge must be used within OrderDataAccessBridge.Provider");
