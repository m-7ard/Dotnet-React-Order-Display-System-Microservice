import IProductHistoryDataAccess from "../../presentation/interfaces/dataAccess/IProductHistoryDataAccess";
import IListProductHistoriesRequestDTO from "../contracts/productHistories/list/IListProductHistoriesRequestDTO";
import { getApiUrl } from "../../viteUtils";
import getUrlParams from "../../presentation/utils/getUrlParams";
import { TokenStorage } from "../../presentation/deps/tokenStorage";

export default class ProductHistoryDataAccess implements IProductHistoryDataAccess {
    private readonly _apiRoute = `${getApiUrl()}/api/product_histories`;

    constructor(private readonly tokenStorage: TokenStorage) {}
    
    async listProductHistories(request: IListProductHistoriesRequestDTO): Promise<Response> {
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
}