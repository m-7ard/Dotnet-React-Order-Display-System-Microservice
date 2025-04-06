import { useRouterLoaderData } from "../../routes/RouterModule/RouterModule.hooks";
import ProductHistoriesPage from "./ProductHistories.Page";

export default function ProductHistoriesController() {
    const { productHistories } = useRouterLoaderData((keys) => keys.LIST_PRODUCT_HISTORIES);
    return <ProductHistoriesPage productHistories={productHistories} />;
}
