import { IRouteConfigMapping } from "../routeTypes";

export const tanstackConfigs: IRouteConfigMapping = {
    // Base
    FRONTPAGE: {
        build: () => "/",
        pattern: "/",
    },

    // Orders
    LIST_ORDERS: {
        pattern: "/orders",
        build: () => "/orders",
    },
    CREATE_ORDER: {
        pattern: "/orders/create",
        build: () => "/orders/create",
    },
    MANAGE_ORDERS: {
        pattern: "/orders/$id/manage",
        build: ({ id }) => `/order/${id}/manage`,
    },
    SERVING_ORDERS: {
        pattern: "/orders/serving",
        build: () => "/orders/serving",
    },

    // Products
    LIST_PRODUCTS: {
        pattern: "/products",
        build: () => "/products",
    },
    CREATE_PRODUCT: {
        pattern: "/products/create",
        build: () => "/products/create",
    },
    UPDATE_PRODUCT: {
        pattern: "/products/$id/update",
        build: ({ id }) => `/products/${id}/update`,
    },
    UPDATE_PRODUCT_AMOUNT: {
        pattern: "/products/$id/update-amount",
        build: ({ id }) => `/products/${id}/update-amount`,
    },

    // Product Histories
    LIST_PRODUCT_HISTORIES: {
        pattern: "/product_histories",
        build: () => "/product_histories",
    },

    // Users
    REGISTER_USER: {
        pattern: "/users/register",
        build: () => "/users/register",
    },
    LOGIN_USER: {
        pattern: "/users/login",
        build: () => "/users/login",
    },

    // Errors
    LOADER_ERROR: {
        pattern: "/errors/loader",
        build: () => "/errors/loader",
    },
    UNKNOWN_ERROR: {
        pattern: "/errors/unknown",
        build: () => "/errors/unknown",
    },
    NOT_FOUND_ERROR: {
        pattern: "/errors/not_found",
        build: () => "/errors/not_found",
    },
    INTERNAL_SERVER_ERROR: {
        pattern: "/errors/internal_server_error",
        build: () => "/errors/internal_server_error",
    },
    CLIENT_SIDE_ERROR: {
        pattern: "/errors/client_side",
        build: () => "/errors/client_side",
    },
    CRASH_ERROR: {
        pattern: "/errors/crash",
        build: () => "/errors/crash",
    }
};