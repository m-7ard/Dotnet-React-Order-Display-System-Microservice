import ApplicationError from "application/errors/ApplicationError";

class RegularRegisterUserFailedError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "RegularRegisterUserFailedError", path);
    }
}

export default RegularRegisterUserFailedError;
