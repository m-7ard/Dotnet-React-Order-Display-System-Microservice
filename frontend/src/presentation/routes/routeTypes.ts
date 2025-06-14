import IProduct from "../../domain/models/IProduct";
import ProductHistory from "../../domain/models/IProductHistory";
import Order from "../../domain/models/Order";


/* 

    Defining the Params of each route

*/
/* eslint-disable @typescript-eslint/no-explicit-any */
type TRouteParams = Record<string, string>;
export interface IManageOrderParams extends TRouteParams {
    id: string;
}
export interface IUpdateProductParams extends TRouteParams {
    id: string;
}
export interface IUpdateProductAmountParams extends TRouteParams {
    id: string;
}
export type TEmptyParams = TRouteParams;


/* 

    Defining the Loader Data of each route

*/
type TEmptyLoaderData = never;
export type TErrorPageLoaderData = { error: Error };

export type TListOrdersLoaderData = { orders: Order[] };
export type TManageOrderLoaderData = { order: Order };

export type TListProductsLoaderData = { products: IProduct[] };
export type TUpdateProductLoaderData = { product: IProduct };
export type TUpdateProductAmountLoaderData = { product: IProduct };

export type TListProductHistoriesLoaderData = { productHistories: ProductHistory[] };


/*

    Defining how each route is built and what its pattern will be.
    The pattern will match the specific router implementation.

*/
export interface IRouteConfig<Params extends TRouteParams> {
    build: (props: Params) => string;
    pattern: string;
}

export interface IRouteConfigMapping {
    FRONTPAGE: IRouteConfig<TEmptyParams>;

    LIST_ORDERS: IRouteConfig<TEmptyParams>;
    CREATE_ORDER: IRouteConfig<TEmptyParams>;
    MANAGE_ORDERS: IRouteConfig<IManageOrderParams>;
    SERVING_ORDERS: IRouteConfig<TEmptyParams>;

    LIST_PRODUCTS: IRouteConfig<TEmptyParams>;
    CREATE_PRODUCT: IRouteConfig<TEmptyParams>;
    UPDATE_PRODUCT: IRouteConfig<IUpdateProductParams>;
    UPDATE_PRODUCT_AMOUNT: IRouteConfig<IUpdateProductAmountParams>;

    LIST_PRODUCT_HISTORIES: IRouteConfig<TEmptyParams>;
    
    REGISTER_USER: IRouteConfig<TEmptyParams>;
    LOGIN_USER: IRouteConfig<TEmptyParams>;

    LOADER_ERROR: IRouteConfig<TEmptyParams>;
    UNKNOWN_ERROR: IRouteConfig<TEmptyParams>;
    NOT_FOUND_ERROR: IRouteConfig<TEmptyParams>;
    INTERNAL_SERVER_ERROR: IRouteConfig<TEmptyParams>;
    CLIENT_SIDE_ERROR: IRouteConfig<TEmptyParams>;
    CRASH_ERROR: IRouteConfig<TEmptyParams>;
}


/*

    Defines the route hierarchy and data associated with that route

*/
export type ICommonRoute<Config extends IRouteConfig<any>, LoaderData> = {
    __loaderDataType?: LoaderData;

    parent: null | ICommonRoute<any, any>;
    label: string | null;
    description: string | null;
    isLayout: boolean;
    config?: Config;
};


/*

    Reusable helper types.

*/
export type TAnyGenericRoute = ICommonRoute<IRouteConfig<any>, any>;
export type TExtractGenericRouteParams<T> = T extends ICommonRoute<IRouteConfig<infer Params>, any> ? Params : never;
export type TExtractGenericRouteLoaderData<T> = T extends ICommonRoute<IRouteConfig<any>, infer LoaderData> ? NonNullable<LoaderData> : never;


/*

    Type guard for layout routes. Layout Routes don't have configs.

*/
export function isLayoutRoute<T extends TAnyGenericRoute>(route: T): route is T & { isLayout: true; config: undefined } {
    return route.isLayout === true && route.config === undefined;
}


/*

    Defines the common route maps that each router needs to define.

*/
export interface ICommonRouteMapping {
    // Base
    FRONTPAGE: ICommonRoute<IRouteConfig<TEmptyParams>, TEmptyLoaderData>;

    // Orders
    LIST_ORDERS: ICommonRoute<IRouteConfig<TEmptyParams>, { orders: Order[] }>;
    CREATE_ORDER: ICommonRoute<IRouteConfig<TEmptyParams>, TEmptyLoaderData>;
    MANAGE_ORDER: ICommonRoute<IRouteConfig<IManageOrderParams>, { order: Order }>;
    SERVING_ORDERS: ICommonRoute<IRouteConfig<TEmptyParams>, { orders: Order[] }>;

    // Products
    LIST_PRODUCTS: ICommonRoute<IRouteConfig<TEmptyParams>, { products: IProduct[] }>;
    CREATE_PRODUCT: ICommonRoute<IRouteConfig<TEmptyParams>, TEmptyLoaderData>;
    UPDATE_PRODUCT: ICommonRoute<IRouteConfig<IUpdateProductParams>, { product: IProduct }>;
    UPDATE_PRODUCT_AMOUNT: ICommonRoute<IRouteConfig<IUpdateProductAmountParams>, { product: IProduct }>;

    // Product Histories
    LIST_PRODUCT_HISTORIES: ICommonRoute<IRouteConfig<TEmptyParams>, { productHistories: ProductHistory[] }>;

    // Users
    REGISTER_USER: ICommonRoute<IRouteConfig<TEmptyParams>, TEmptyLoaderData>;
    LOGIN_USER: ICommonRoute<IRouteConfig<TEmptyParams>, TEmptyLoaderData>;

    // Errors
    LOADER_ERROR: ICommonRoute<IRouteConfig<TEmptyParams>, TErrorPageLoaderData>;
    UNKNOWN_ERROR: ICommonRoute<IRouteConfig<TEmptyParams>, TErrorPageLoaderData>;
    NOT_FOUND_ERROR: ICommonRoute<IRouteConfig<TEmptyParams>, TErrorPageLoaderData>;
    INTERNAL_SERVER_ERROR: ICommonRoute<IRouteConfig<TEmptyParams>, TErrorPageLoaderData>;
    CLIENT_SIDE_ERROR: ICommonRoute<IRouteConfig<TEmptyParams>, TErrorPageLoaderData>;
}
