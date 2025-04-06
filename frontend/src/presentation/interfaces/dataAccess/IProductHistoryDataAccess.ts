import IListProductHistoriesRequestDTO from "../../../infrastructure/contracts/productHistories/list/IListProductHistoriesRequestDTO";

export default interface IProductHistoryDataAccess {
    listProductHistories(request: IListProductHistoriesRequestDTO): Promise<Response>;
}
