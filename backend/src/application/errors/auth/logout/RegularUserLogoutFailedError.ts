import ApplicationError from "application/errors/ApplicationError";

class RegularUserLogoutFailedError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "RegularUserLogoutFailedError", path);
    }
}

export default RegularUserLogoutFailedError;
