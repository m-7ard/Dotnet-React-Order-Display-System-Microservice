import { useLoaderData, useLocation, useNavigate } from "@tanstack/react-router";
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
    isLayout: false,
};

// orders

const listOrders: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: frontpage,
    config: tanstackConfigs.LIST_ORDERS,
    label: "Orders",
    isLayout: false,
};

const createOrder: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: listOrders,
    config: tanstackConfigs.CREATE_ORDER,
    label: "Create",
    isLayout: false,
};

const __orderIdLayout__: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: listOrders,
    label: ":id",
    isLayout: true,
};

const manageOrder: ICommonRoute<IRouteConfig<IManageOrderParams>, never> = {
    parent: __orderIdLayout__,
    config: tanstackConfigs.MANAGE_ORDERS,
    label: "Manage",
    isLayout: false,
};

// products
const listProducts: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: frontpage,
    config: tanstackConfigs.LIST_PRODUCTS,
    label: "Products",
    isLayout: false,
};

const createProduct: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: listProducts,
    config: tanstackConfigs.CREATE_PRODUCT,
    label: "Create",
    isLayout: false,
};

const updateProduct: ICommonRoute<IRouteConfig<IUpdateProductParams>, never> = {
    parent: listProducts,
    config: tanstackConfigs.UPDATE_PRODUCT,
    label: "Update",
    isLayout: false,
};

const updateProductAmount: ICommonRoute<IRouteConfig<IUpdateProductAmountParams>, never> = {
    parent: listProducts,
    config: tanstackConfigs.UPDATE_PRODUCT_AMOUNT,
    label: "Update Amount",
    isLayout: false,
};

// Product histories
const listProductHistories: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: frontpage,
    config: tanstackConfigs.LIST_PRODUCT_HISTORIES,
    label: "Product Histories",
    isLayout: false,
};

// Users
const __usersLayout__: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: frontpage,
    label: "Users",
    isLayout: true,
};

const registerUser: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: __usersLayout__,
    config: tanstackConfigs.REGISTER_USER,
    label: "Register",
    isLayout: false,
};

const loginUser: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: __usersLayout__,
    config: tanstackConfigs.LOGIN_USER,
    label: "Login",
    isLayout: false,
};

// Errors
const __errorsLayout__: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: frontpage,
    label: "Errors",
    isLayout: true,
};

const loaderError: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.LOADER_ERROR,
    label: "Loader",
    isLayout: false,
};
const unknownError: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.UNKNOWN_ERROR,
    label: "Unknown",
    isLayout: false,
};
const notFoundError: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.NOT_FOUND_ERROR,
    label: "Not Found",
    isLayout: false,
};
const internalServerError: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.INTERNAL_SERVER_ERROR,
    label: "Internal Server Error",
    isLayout: false,
};
const clientSideError: ICommonRoute<IRouteConfig<TEmptyParams>, never> = {
    parent: __errorsLayout__,
    config: tanstackConfigs.CLIENT_SIDE_ERROR,
    label: "Client Side Error",
    isLayout: false,
};

const genericRoutes: ICommonRouteMapping = {
    // Base
    FRONTPAGE: frontpage,

    // Orders
    LIST_ORDERS: listOrders,
    CREATE_ORDER: createOrder,
    MANAGE_ORDER: manageOrder,

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
    CLIENT_SIDE_ERROR: clientSideError
};

function useRouterLoaderData<T extends TAnyGenericRoute>(exp: (keys: ICommonRouteMapping) => T): TExtractGenericRouteLoaderData<T> {
    const data = useLoaderData({ from: exp(genericRoutes).config?.pattern as never });
    return data as TExtractGenericRouteLoaderData<T>;
}
function useRouterLocationEq() {
    const location = useLocation();

    return <T extends TAnyGenericRoute>(exp: (keys: ICommonRouteMapping) => T) => {
        const route = exp(genericRoutes);
        return location.pathname === route.config?.pattern;
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

const tanstackRouterModule: IRouterModule = {
    genericRoutes: genericRoutes,
    useRouterLoaderData: useRouterLoaderData,
    useRouterLocationEq: useRouterLocationEq,
    useRouterNavigate: useRouterNavigate,
    useRouterHref: useRouterHref
};

export default tanstackRouterModule;
