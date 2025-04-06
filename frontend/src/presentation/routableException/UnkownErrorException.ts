import RoutableException from './RoutableException';

class UnkownErrorException extends RoutableException {
    constructor(message: string) {
        super(message, (routes) => routes.UNKNOWN_ERROR);
    }
}

export default UnkownErrorException;