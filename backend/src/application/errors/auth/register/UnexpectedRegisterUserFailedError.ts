import ApplicationError from "application/errors/ApplicationError";

class UnexpectedRegisterUserFailedError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "UnexpectedRegisterUserFailedError", path);
    }
}

export default UnexpectedRegisterUserFailedError;
