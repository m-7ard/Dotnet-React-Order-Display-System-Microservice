export default class OrderItemStatus {
    public static readonly PENDING = new OrderItemStatus('Pending');
    public static readonly FINISHED = new OrderItemStatus('Finished');

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string) {
        if (value === OrderItemStatus.FINISHED.value) {
            return OrderItemStatus.FINISHED;
        } else if (value === OrderItemStatus.PENDING.value) {
            return OrderItemStatus.PENDING;
        } else {
            throw new Error(`${value} is not a valid OrderItemStatus`);
        }
    }

    public value: string;
}