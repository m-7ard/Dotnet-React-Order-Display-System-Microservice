export default class OrderStatus {
    public static readonly PENDING = new OrderStatus('Pending');
    public static readonly FINISHED = new OrderStatus('Finished');

    private static readonly validStatuses = [
        OrderStatus.PENDING,
        OrderStatus.FINISHED
    ];

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string) {
        if (value === OrderStatus.FINISHED.value) {
            return OrderStatus.FINISHED;
        } else if (value === OrderStatus.PENDING.value) {
            return OrderStatus.PENDING;
        } else {
            throw new Error(`${value} is not a valid OrderStatus`);
        }
    }

    public static isValid(status: string): boolean {
        return OrderStatus.validStatuses.some(validStatus => validStatus.value === status);
    }

    public value: string;
}