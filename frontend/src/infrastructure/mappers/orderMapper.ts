import Order from "../../domain/models/Order";
import OrderStatus from "../../domain/valueObjects/Order/OrderStatus";
import IOrderApiModel from "../apiModels/IOrderApiModel";
import orderItemMapper from "./orderItemMapper";

const orderMapper = {
    apiToDomain: (source: IOrderApiModel): Order => {
        return new Order({
            id: source.id,
            total: source.total,
            status: OrderStatus.create(source.status),
            dateCreated: new Date(source.dateCreated),
            dateFinished: source.dateFinished == null ? null : new Date(source.dateFinished),
            orderItems: source.orderItems.map(orderItemMapper.apiToDomain),
            serialNumber: source.serialNumber
        });
    },
};

export default orderMapper;
