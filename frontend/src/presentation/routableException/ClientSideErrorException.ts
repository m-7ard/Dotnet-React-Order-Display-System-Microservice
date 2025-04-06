import RoutableException from './RoutableException';

class ClientSideErrorException extends RoutableException {
    constructor(message: string) {
        super(message, (routes) => routes.CLIENT_SIDE_ERROR);
    }
}

export default ClientSideErrorException;