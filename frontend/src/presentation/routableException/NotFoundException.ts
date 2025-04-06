import RoutableException from "./RoutableException";

class NotFoundException extends RoutableException {
    constructor(message: string) {
        super(message, (routes) => routes.NOT_FOUND_ERROR);
    }
}

export default NotFoundException;
