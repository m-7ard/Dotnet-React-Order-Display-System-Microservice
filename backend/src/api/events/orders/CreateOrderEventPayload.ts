import IOrderApiModel from "infrastructure/models/IOrderApiModel";

interface CreateOrderEventPayload {
    order: IOrderApiModel;
    userId: string;
}

export default CreateOrderEventPayload;
