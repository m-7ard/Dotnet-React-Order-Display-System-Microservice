import IOrderApiModel from "../../../apiModels/IOrderApiModel";

interface CreateOrderEventPayload {
    order: IOrderApiModel;
}

export default CreateOrderEventPayload;