import IOrderApiModel from "infrastructure/models/IOrderApiModel";

interface UpdateOrderEventPayload {
    order: IOrderApiModel;
    userId: string;
}

export default UpdateOrderEventPayload;
