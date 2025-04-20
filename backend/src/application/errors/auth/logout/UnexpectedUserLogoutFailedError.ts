import ApplicationError from "application/errors/ApplicationError";

class UnexpectedUserLogoutFailedError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "UnexpectedUserLogoutFailedError", path);
    }
}

export default UnexpectedUserLogoutFailedError;
