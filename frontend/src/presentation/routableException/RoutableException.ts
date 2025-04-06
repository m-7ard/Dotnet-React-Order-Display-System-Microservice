import { ICommonRouteMapping, TAnyGenericRoute } from "../routes/routeTypes";

class RoutableException extends Error {
    constructor(message: string, routeExp: (routes: ICommonRouteMapping) => TAnyGenericRoute) {
        super(message);
        this.name = this.constructor.name;
        this.routeExp = routeExp;
    }

    public routeExp: (routes: ICommonRouteMapping) => TAnyGenericRoute;
}

export default RoutableException;
