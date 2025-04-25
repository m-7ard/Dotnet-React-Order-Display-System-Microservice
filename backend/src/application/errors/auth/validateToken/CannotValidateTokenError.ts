import ApplicationError from "application/errors/ApplicationError";

class CannotValidateTokenError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CannotValidateTokenError", path);
    }
}

export default CannotValidateTokenError;
