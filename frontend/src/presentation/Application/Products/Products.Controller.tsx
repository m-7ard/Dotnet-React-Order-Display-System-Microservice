import { useRouterLoaderData } from "../../routes/RouterModule/RouterModule.hooks";
import ProductsPage from "./Products.Page";

export default function ProductsController() {
    const { products } = useRouterLoaderData((keys) => keys.LIST_PRODUCTS);

    return <ProductsPage products={products} />;
}
