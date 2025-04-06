import IProductHistoryDataAccess from "../../presentation/interfaces/dataAccess/IProductHistoryDataAccess";
import IListProductHistoriesRequestDTO from "../contracts/productHistories/list/IListProductHistoriesRequestDTO";
import { getApiUrl } from "../../viteUtils";
import getUrlParams from "../../presentation/utils/getUrlParams";

export default class ProductHistoryDataAccess implements IProductHistoryDataAccess {
    private readonly _apiRoute = `${getApiUrl()}/api/product_histories`;
    
    async listProductHistories(request: IListProductHistoriesRequestDTO): Promise<Response> {
        const urlParams = getUrlParams(request);
        const response = await fetch(`${this._apiRoute}/list?${urlParams}`, {
            method: "GET"
        });

        return response;
    }
}