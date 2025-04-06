import OrderItemStatus from "../valueObjects/OrderItem/OrderItemStatus";
import ProductHistory from "./IProductHistory";
import Order from "./Order";

export default class OrderItem {
    constructor(props: {
        id: string;
        quantity: number;
        status: OrderItemStatus;
        dateCreated: Date;
        dateFinished: Date | null;
        orderId: Order["id"];
        productHistory: ProductHistory;
        serialNumber: number;
    }) {
        this.id = props.id;
        this.quantity = props.quantity;
        this.status = props.status;
        this.dateCreated = props.dateCreated;
        this.dateFinished = props.dateFinished;
        this.orderId = props.orderId;
        this.productHistory = props.productHistory;
        this.serialNumber = props.serialNumber;
    }

    getTotal(): number {
        return Math.round(this.productHistory.price * this.quantity * 100) / 100;
    }
    
    canMarkFinished(): boolean {
        return this.status === OrderItemStatus.PENDING;
    }

    public id: string;
    public quantity: number;
    public status: OrderItemStatus;
    public dateCreated: Date;
    public dateFinished: Date | null;
    public orderId: Order["id"];
    public productHistory: ProductHistory;
    public serialNumber: number;
}