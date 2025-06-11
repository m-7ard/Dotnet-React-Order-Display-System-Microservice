import { useLoaderData, useLocation, useNavigate, useRouterState } from "@tanstack/react-router";
import {
    ICommonRoute,
    IRouteConfig,
    TEmptyParams,
    IManageOrderParams,
    IUpdateProductParams,
    ICommonRouteMapping,
    TAnyGenericRoute,
    TExtractGenericRouteLoaderData,
    TExtractGenericRouteParams,
    IUpdateProductAmountParams,
} from "../routeTypes";
import { IRouterModule } from "../RouterModule/RouterModule";
import { tanstackConfigs } from "./tanstackConfig";

const frontpage: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: null,
    config: tanstackConfigs.FRONTPAGE,
    label: "All",
    description: "Frontpage",
    isLayout: false,
};

// orders

const listOrders: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: frontpage,
    config: tanstackConfigs.LIST_ORDERS,
    label: "Orders",
    description: "List Orders",
    isLayout: false,
};

const createOrder: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: listOrders,
    config: tanstackConfigs.CREATE_ORDER,
    label: "Create",
    description: "Create Order",
    isLayout: false,
};

const servingOrders: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: listOrders,
    config: tanstackConfigs.SERVING_ORDERS,
    label: "Serving",
    description: "Serving Orders",
    isLayout: false,
};

const __orderIdLayout__: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: listOrders,
    label: ":id",
    description: "Order ID Layout",
    isLayout: true,
};

const manageOrder: ICommonRoute<IRouteConfig<IManageOrderParams>, never> = {
    parent: __orderIdLayout__,
    config: tanstackConfigs.MANAGE_ORDERS,
    label: "Manage",
    description: "Manage Order",
    isLayout: false,
};

// products
const listProducts: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: frontpage,
    config: tanstackConfigs.LIST_PRODUCTS,
    label: "Products",
    description: "List Products",
    isLayout: false,
};

const createProduct: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: listProducts,
    config: tanstackConfigs.CREATE_PRODUCT,
    label: "Create",
    description: "Create Product",
    isLayout: false,
};

const updateProduct: ICommonRoute<IRouteConfig<IUpdateProductParams>, never> = {
    parent: listProducts,
    config: tanstackConfigs.UPDATE_PRODUCT,
    label: "Update",
    description: "Update Product",
    isLayout: false,
};

const updateProductAmount: ICommonRoute<IRouteConfig<IUpdateProductAmountParams>, never> = {
    parent: listProducts,
    config: tanstackConfigs.UPDATE_PRODUCT_AMOUNT,
    label: "Update Amount",
    description: "Update Product Amount",
    isLayout: false,
};

// Product histories
const listProductHistories: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: frontpage,
    config: tanstackConfigs.LIST_PRODUCT_HISTORIES,
    label: "Product Histories",
    description: "List Product Histories",
    isLayout: false,
};

// Users
const __usersLayout__: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: frontpage,
    label: "Users",
    description: "Users Layout",
    isLayout: true,
};

const registerUser: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: __usersLayout__,
    config: tanstackConfigs.REGISTER_USER,
    label: "Register",
    description: "Register User",
    isLayout: false,
};

const loginUser: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: __usersLayout__,
    config: tanstackConfigs.LOGIN_USER,
    label: "Login",
    description: "Login User",
    isLayout: false,
};

// Errors
const __errorsLayout__: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: frontpage,
    label: "Errors",
    description: "Errors Layout",
    isLayout: true,
};

const loaderError: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.LOADER_ERROR,
    label: "Loader",
    description: "Loader Error",
    isLayout: false,
};
const unknownError: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.UNKNOWN_ERROR,
    label: "Unknown",
    description: "Unknown Error",
    isLayout: false,
};
const notFoundError: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.NOT_FOUND_ERROR,
    label: "Not Found",
    description: "Not Found Error",
    isLayout: false,
};
const internalServerError: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.INTERNAL_SERVER_ERROR,
    label: "Internal Server Error",
    description: "Internal Server Error",
    isLayout: false,
};
const clientSideError: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.CLIENT_SIDE_ERROR,
    label: "Client Side Error",
    description: "Client Side Error",
    isLayout: false,
};

const genericRoutes: ICommonRouteMapping = {
    // Base
    FRONTPAGE: frontpage,

    // Orders
    LIST_ORDERS: listOrders,
    CREATE_ORDER: createOrder,
    MANAGE_ORDER: manageOrder,
    SERVING_ORDERS: servingOrders,

    // Products
    LIST_PRODUCTS: listProducts,
    CREATE_PRODUCT: createProduct,
    UPDATE_PRODUCT: updateProduct,
    UPDATE_PRODUCT_AMOUNT: updateProductAmount,

    // Product Histories
    LIST_PRODUCT_HISTORIES: listProductHistories,

    // Users
    REGISTER_USER: registerUser,
    LOGIN_USER: loginUser,

    // Errors
    LOADER_ERROR: loaderError,
    UNKNOWN_ERROR: unknownError,
    NOT_FOUND_ERROR: notFoundError,
    INTERNAL_SERVER_ERROR: internalServerError,
    CLIENT_SIDE_ERROR: clientSideError,
};

function useRouterLoaderData<T extends TAnyGenericRoute>(exp: (keys: ICommonRouteMapping) => T): TExtractGenericRouteLoaderData<T> {
    const data = useLoaderData({ from: exp(genericRoutes).config?.pattern as never });
    return data as TExtractGenericRouteLoaderData<T>;
}

const useRouteId = () => {
    return useRouterState({ select: (s) => s }).matches.at(-1)?.routeId;
};

function useRouterLocationEq() {
    const pattern = useRouteId();

    return <T extends TAnyGenericRoute>(exp: (keys: ICommonRouteMapping) => T) => {
        const route = exp(genericRoutes);
        return pattern === route.config?.pattern;
    };
}

function useRouterNavigate() {
    const navigate = useNavigate();

    const navigateFn = <T extends TAnyGenericRoute>({
        exp,
        params,
        search,
    }: {
        exp: (keys: ICommonRouteMapping) => T;
        params: TExtractGenericRouteParams<T>;
        search?: Record<string, string>;
    }) => {
        const route = exp(genericRoutes);

        if (route.config == null) {
            throw new Error("Navigate's route's config cannot be undefined or be a layout.");
        }

        navigate({ to: route.config!.pattern, params: params, search: search });
    };

    return navigateFn;
}

function useRouterHref() {
    const location = useLocation();
    return location.href;
}

function useRouterCurrentRoute() {
    const pattern = useRouteId();

    for (const key in genericRoutes) {
        const route = genericRoutes[key as keyof ICommonRouteMapping];
        if (route.config?.pattern === pattern) {
            return route;
        }
    }

    throw new Error("useRouterCurrentRoute: Current route has not been configured or is misconfigured in the mapping.");
}

const tanstackRouterModule: IRouterModule = {
    genericRoutes: genericRoutes,
    useRouterLoaderData: useRouterLoaderData,
    useRouterLocationEq: useRouterLocationEq,
    useRouterNavigate: useRouterNavigate,
    useRouterHref: useRouterHref,
    useRouterCurrentRoute: useRouterCurrentRoute,
};

export default tanstackRouterModule;
