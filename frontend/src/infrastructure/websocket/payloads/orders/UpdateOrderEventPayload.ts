import IOrderApiModel from "../../../apiModels/IOrderApiModel";

interface UpdateOrderEventPayload {
    order: IOrderApiModel;
}

export default UpdateOrderEventPayload;