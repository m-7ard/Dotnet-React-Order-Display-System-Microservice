import IOrderApiModel from "../../../apiModels/IOrderApiModel";

type ICreateOrderResponseDTO = {
    orderId: IOrderApiModel["id"];
};

export default ICreateOrderResponseDTO;
