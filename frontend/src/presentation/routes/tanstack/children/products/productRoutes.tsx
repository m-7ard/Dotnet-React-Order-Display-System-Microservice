import { createRoute } from "@tanstack/react-router";
import UpdateProductController from "../../../../Application/Products/Update/UpdateProduct.Controller";
import { productDataAccess } from "../../../../deps/dataAccess";
import ProductsController from "../../../../Application/Products/Products.Controller";
import CreateProductController from "../../../../Application/Products/Create/CreateProduct.Controller";
import IReadProductResponseDTO from "../../../../../infrastructure/contracts/products/read/IReadProductResponseDTO";
import productMapper from "../../../../../infrastructure/mappers/productMapper";
import IListProductsResponseDTO from "../../../../../infrastructure/contracts/products/list/IListProductsResponseDTO";
import parseListProductsRequestDTO from "../../../../../infrastructure/parsers/parseListProductsRequestDTO";
import { IUpdateProductAmountParams, IUpdateProductParams, TListProductsLoaderData, TUpdateProductAmountLoaderData, TUpdateProductLoaderData } from "../../../routeTypes";
import { tanstackConfigs } from "../../tanstackConfig";
import diContainer, { DI_TOKENS } from "../../../../deps/diContainer";
import UpdateProductAmountController from "../../../../Application/Products/UpdateAmount/UpdateProductAmount.Controller";
import { authRootRoute } from "../../rootRoute";

const listProductsRoute = createRoute({
    getParentRoute: () => authRootRoute,
    path: tanstackConfigs.LIST_PRODUCTS.pattern,
    loaderDeps: ({ search }: { search: Record<string, string> }) => search,
    loader: async ({ deps }): Promise<TListProductsLoaderData> => {
        const params = parseListProductsRequestDTO(deps);
        const { requestHandler } = diContainer.resolve(DI_TOKENS.ROUTER_CONTEXT);

        const response = await requestHandler.handleRequest(productDataAccess.listProducts(params));
        if (!response.ok) {
            await requestHandler.handleInvalidResponse(response);
        }

        const data: IListProductsResponseDTO = await response.json();
        return {
            products: data.products.map(productMapper.apiToDomain),
        };
    },
    component: ProductsController,
});

const createProductRoute = createRoute({
    getParentRoute: () => authRootRoute,
    path: tanstackConfigs.CREATE_PRODUCT.pattern,
    component: () => <CreateProductController />,
});

const updateProductRoute = createRoute({
    getParentRoute: () => authRootRoute,
    path: tanstackConfigs.UPDATE_PRODUCT.pattern,
    component: () => <UpdateProductController />,
    loader: async ({ params }: { params: IUpdateProductParams }): Promise<TUpdateProductLoaderData> => {
        const id = params.id;
        const { requestHandler } = diContainer.resolve(DI_TOKENS.ROUTER_CONTEXT);

        const response = await requestHandler.handleRequest(productDataAccess.readProduct({ id: id }));
        if (!response.ok) {
            await requestHandler.handleInvalidResponse(response);
        }

        const dto: IReadProductResponseDTO = await response.json();
        const product = productMapper.apiToDomain(dto.product);

        return {
            product: product,
        };
    },
});

const updateProductAmountRoute = createRoute({
    getParentRoute: () => authRootRoute,
    path: tanstackConfigs.UPDATE_PRODUCT_AMOUNT.pattern,
    component: () => <UpdateProductAmountController />,
    loader: async ({ params }: { params: IUpdateProductAmountParams }): Promise<TUpdateProductAmountLoaderData> => {
        const id = params.id;
        const { requestHandler } = diContainer.resolve(DI_TOKENS.ROUTER_CONTEXT);

        const response = await requestHandler.handleRequest(productDataAccess.readProduct({ id: id }));
        if (!response.ok) {
            await requestHandler.handleInvalidResponse(response);
        }

        const dto: IReadProductResponseDTO = await response.json();
        const product = productMapper.apiToDomain(dto.product);

        return {
            product: product,
        };
    },
});

export default [listProductsRoute, createProductRoute, updateProductRoute, updateProductAmountRoute];
