import { createRoute } from "@tanstack/react-router";
import rootRoute from "../../rootRoute";
import { productHistoryDataAccess } from "../../../../deps/dataAccess";
import IListProductHistoriesResponseDTO from "../../../../../infrastructure/contracts/productHistories/list/IListProductHistoriesResponseDTO";
import productHistoryMapper from "../../../../../infrastructure/mappers/productHistoryMapper";
import ProductHistoriesController from "../../../../Application/ProductHistories/ProductHistories.Controller";
import parseListProductHistoriesRequestDTO from "../../../../../infrastructure/parsers/parseListProductHistoriesRequestDTO";
import { TListProductHistoriesLoaderData } from "../../../routeTypes";
import { tanstackConfigs } from "../../tanstackConfig";
import diContainer, { DI_TOKENS } from "../../../../deps/diContainer";

const listProductHistoriesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.LIST_PRODUCT_HISTORIES.pattern,
    loaderDeps: ({ search }: { search: Record<string, string> }) => search,
    loader: async ({ deps }): Promise<TListProductHistoriesLoaderData> => {
        const params = parseListProductHistoriesRequestDTO(deps);
        const { requestHandler } = diContainer.resolve(DI_TOKENS.ROUTER_CONTEXT);

        const response = await requestHandler.handleRequest(productHistoryDataAccess.listProductHistories(params));
        if (!response.ok) {
            await requestHandler.handleInvalidResponse(response);
        }

        const dto: IListProductHistoriesResponseDTO = await response.json();
        return {
            productHistories: dto.productHistories.map(productHistoryMapper.apiToDomain),
        };
    },
    component: ProductHistoriesController,
});

export default [listProductHistoriesRoute];
