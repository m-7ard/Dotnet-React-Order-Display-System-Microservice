import IOrderApiModel from "../../../apiModels/IOrderApiModel";

type IListOrdersResponseDTO = {
    orders: IOrderApiModel[];
}

export default IListOrdersResponseDTO;