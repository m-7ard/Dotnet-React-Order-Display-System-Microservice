import OrderStatus from "../valueObjects/Order/OrderStatus";
import OrderItemStatus from "../valueObjects/OrderItem/OrderItemStatus";
import OrderItem from "./OrderItem";

export default class Order {
    constructor(props: {
        id: string;
        total: number;
        status: OrderStatus;
        dateCreated: Date;
        dateFinished: Date | null;
        orderItems: OrderItem[];
        serialNumber: number;
    }) {
        this.id = props.id;
        this.total = props.total;
        this.status = props.status;
        this.dateCreated = props.dateCreated;
        this.dateFinished = props.dateFinished;
        this.orderItems = props.orderItems;
        this.serialNumber = props.serialNumber;
    }

    public id: string;
    public total: number;
    public status: OrderStatus;
    public dateCreated: Date;
    public dateFinished: Date | null;
    public orderItems: OrderItem[];
    public serialNumber: number;

    canMarkFinished(): boolean {
        return this.orderItems.every((orderItem) => orderItem.status === OrderItemStatus.FINISHED);
    }
}