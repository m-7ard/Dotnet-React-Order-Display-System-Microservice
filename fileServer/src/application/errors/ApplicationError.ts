export default class ApplicationError extends Error {
    constructor(public readonly message: string, public readonly code: string, public readonly path: string[] = []) {
        super(message);
    }

    asList() {
        return [this];
    }
}