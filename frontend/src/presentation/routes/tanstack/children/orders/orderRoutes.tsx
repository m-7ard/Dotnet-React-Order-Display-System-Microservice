import { createRoute } from "@tanstack/react-router";
import rootRoute from "../../rootRoute";
import ManageOrderController from "../../../../Application/Orders/Manage/ManageOrder.Controller";
import CreateOrderController from "../../../../Application/Orders/Create/CreateOrder.Controller";
import { orderDataAccess } from "../../../../deps/dataAccess";
import IListOrdersResponseDTO from "../../../../../infrastructure/contracts/orders/list/IListOrdersResponseDTO";
import orderMapper from "../../../../../infrastructure/mappers/orderMapper";
import OrdersController from "../../../../Application/Orders/Orders.Controller";
import IReadOrderResponseDTO from "../../../../../infrastructure/contracts/orders/read/IReadOrderResponseDTO";
import parseListOrdersCommandParameters from "../../../../../infrastructure/parsers/parseListOrdersCommandParameters";
import { IManageOrderParams, TListOrdersLoaderData, TManageOrderLoaderData } from "../../../routeTypes";
import { tanstackConfigs } from "../../tanstackConfig";
import diContainer, { DI_TOKENS } from "../../../../deps/diContainer";
import AuthRouteGuard from "../../../../components/RouteGuards/AuthRouteGuard";
import ServingOrdersController from "../../../../Application/Orders/Serving/ServingOrders.Controller";

const listOrdersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.LIST_ORDERS.pattern,
    loaderDeps: ({ search }: { search: Record<string, string> }) => search,
    loader: async ({ deps }): Promise<TListOrdersLoaderData> => {
        const parsedParams = parseListOrdersCommandParameters(deps);
        const { requestHandler } = diContainer.resolve(DI_TOKENS.ROUTER_CONTEXT);

        const response = await requestHandler.handleRequest(orderDataAccess.listOrders(parsedParams));
        if (!response.ok) {
            await requestHandler.handleInvalidResponse(response);
        }

        const data: IListOrdersResponseDTO = await response.json();

        return {
            orders: data.orders.map(orderMapper.apiToDomain),
        };
    },
    component: () => (
        <AuthRouteGuard>
            <OrdersController />
        </AuthRouteGuard>
    ),
});

const servingOrdersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.SERVING_ORDERS.pattern,
    loader: async ({ deps }): Promise<TListOrdersLoaderData> => {
        const parsedParams = parseListOrdersCommandParameters(deps);
        const { requestHandler } = diContainer.resolve(DI_TOKENS.ROUTER_CONTEXT);

        const response = await requestHandler.handleRequest(orderDataAccess.listOrders(parsedParams));
        if (!response.ok) {
            await requestHandler.handleInvalidResponse(response);
        }

        const data: IListOrdersResponseDTO = await response.json();

        return {
            orders: data.orders.map(orderMapper.apiToDomain),
        };
    },
    component: () => (
        <AuthRouteGuard>
            <ServingOrdersController />
        </AuthRouteGuard>
    ),
});

const createOrderRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.CREATE_ORDER.pattern,
    component: () => (
        <AuthRouteGuard>
            <CreateOrderController orderDataAccess={orderDataAccess} />
        </AuthRouteGuard>
    ),
});

const manageOrderRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.MANAGE_ORDERS.pattern,
    loader: async ({ params }: { params: IManageOrderParams }): Promise<TManageOrderLoaderData> => {
        const id = params.id;
        const { requestHandler } = diContainer.resolve(DI_TOKENS.ROUTER_CONTEXT);

        const response = await requestHandler.handleRequest(orderDataAccess.readOrder({ id: id }));
        if (!response.ok) {
            await requestHandler.handleInvalidResponse(response);
        }

        const dto: IReadOrderResponseDTO = await response.json();
        return {
            order: orderMapper.apiToDomain(dto.order),
        };
    },
    component: () => (
        <AuthRouteGuard>
            <ManageOrderController orderDataAccess={orderDataAccess} />
        </AuthRouteGuard>
    ),
});

export default [listOrdersRoute, createOrderRoute, manageOrderRoute, servingOrdersRoute];
