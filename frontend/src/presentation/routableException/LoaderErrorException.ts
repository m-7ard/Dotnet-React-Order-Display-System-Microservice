import RoutableException from "./RoutableException";

class LoaderErrorException extends RoutableException {
    constructor(message: string) {
        super(message, (routes) => routes.LOADER_ERROR);
    }
}

export default LoaderErrorException;
