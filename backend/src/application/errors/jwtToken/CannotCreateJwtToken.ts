import ApplicationError from "application/errors/ApplicationError";

class CannotCreateJwtToken extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CannotCreateJwtToken", path);
    }
}

export default CannotCreateJwtToken;
