import IOrderDataAccess from "../../presentation/interfaces/dataAccess/IOrderDataAccess";
import ICreateOrderRequestDTO from "../contracts/orders/create/ICreateOrderRequestDTO";
import IListOrdersRequestDTO from "../contracts/orders/list/IListOrdersRequestDTO";
import IReadOrderRequestDTO from "../contracts/orders/read/IReadOrderRequestDTO";
import IMarkOrderItemFinishedRequestDTO from "../contracts/orderItems/markFinished/IMarkOrderItemFinishedRequestDTO";
import IMarkOrderFinishedRequestDTO from "../contracts/orders/markFinished/IMarkOrderFinishedRequestDTO";
import { getApiUrl } from "../../viteUtils";
import getUrlParams from "../../presentation/utils/getUrlParams";
import { TokenStorage } from "../../presentation/deps/tokenStorage";

export default class OrderDataAccess implements IOrderDataAccess {
    private readonly _apiRoute = `${getApiUrl()}/api/orders`;

    constructor(private readonly tokenStorage: TokenStorage) {}

    async listOrders(request: IListOrdersRequestDTO): Promise<Response> {
        const urlParams = getUrlParams(request);
        const response = await fetch(`${this._apiRoute}/list?${urlParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.tokenStorage.getAccessToken()}`
            },
        });

        return response;
    }

    async createOrder(request: ICreateOrderRequestDTO): Promise<Response> {
        const response = await fetch(`${this._apiRoute}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.tokenStorage.getAccessToken()}`
            },
            body: JSON.stringify(request),
        });

        return response;
    }

    async readOrder(request: IReadOrderRequestDTO): Promise<Response> {
        const response = await fetch(`${this._apiRoute}/${request.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.tokenStorage.getAccessToken()}`
            },
        });

        return response;
    }

    async markOrderItemFinished(request: IMarkOrderItemFinishedRequestDTO): Promise<Response> {
        const response = await fetch(`${this._apiRoute}/${request.orderId}/item/${request.orderItemId}/mark_finished`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.tokenStorage.getAccessToken()}`
            },
        });

        return response;
    }

    async markOrderFinished(request: IMarkOrderFinishedRequestDTO): Promise<Response> {
        const response = await fetch(`${this._apiRoute}/${request.orderId}/mark_finished`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.tokenStorage.getAccessToken()}`
            },
        });

        return response;
    }
}
