export default abstract class ValueObject<T> {
    protected readonly value: T;

    protected constructor(value: T) {
        this.value = value;
    }

    public equals(vo?: ValueObject<T>): boolean {
        if (vo === null || vo === undefined) {
            return false;
        }

        if (vo instanceof ValueObject) {
            return this.value === vo.value;
        }

        return false;
    }
}