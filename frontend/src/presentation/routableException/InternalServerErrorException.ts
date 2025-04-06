import RoutableException from './RoutableException';

class InternalServerErrorException extends RoutableException {
    constructor(message: string) {
        super(message, (routes) => routes.INTERNAL_SERVER_ERROR);
    }
}

export default InternalServerErrorException;