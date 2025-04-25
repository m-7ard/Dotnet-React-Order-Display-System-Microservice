import IListProductsRequestDTO from "../contracts/products/list/IListProductsRequestDTO";
import IProductDataAccess from "../../presentation/interfaces/dataAccess/IProductDataAccess";
import ICreateProductRequestDTO from "../contracts/products/create/ICreateProductRequestDTO";
import IReadProductRequestDTO from "../contracts/products/read/IReadProductRequestDTO";
import IUpdateProductRequestDTO from "../contracts/products/update/IUpdateProductRequestDTO";
import IDeleteProductRequestDTO from "../contracts/products/delete/IDeleteProductRequestDTO";
import { getApiUrl } from "../../viteUtils";
import getUrlParams from "../../presentation/utils/getUrlParams";
import IUpdateProductAmountRequestDTO from "../contracts/products/updateAmount/IUpdateProductAmountRequestDTO";
import { TokenStorage } from "../../presentation/deps/tokenStorage";

export default class ProductDataAccess implements IProductDataAccess {
    private readonly _apiRoute = `${getApiUrl()}/api/products`;

    constructor(private readonly tokenStorage: TokenStorage) {}
    
    async listProducts(request: IListProductsRequestDTO): Promise<Response> {
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

    async createProduct(request: ICreateProductRequestDTO): Promise<Response> {
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

    async readProduct(request: IReadProductRequestDTO): Promise<Response> {
        const response = await fetch(`${this._apiRoute}/${request.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.tokenStorage.getAccessToken()}`
            },
        });

        return response;
    }

    async updateProduct(request: IUpdateProductRequestDTO): Promise<Response> {
        const response = await fetch(`${this._apiRoute}/${request.id}/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.tokenStorage.getAccessToken()}`
            },
            body: JSON.stringify(request),
        });

        return response;
    }

    async updateProductAmount(id: string, request: IUpdateProductAmountRequestDTO): Promise<Response> {
        const response = await fetch(`${this._apiRoute}/${id}/update-amount`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.tokenStorage.getAccessToken()}`
            },
            body: JSON.stringify(request),
        });

        return response;
    }

    async deleteProduct(request: IDeleteProductRequestDTO): Promise<Response> {
        const response = await fetch(`${this._apiRoute}/${request.id}/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.tokenStorage.getAccessToken()}`
            },
            body: JSON.stringify(request),
        });

        return response;
    }
}

//