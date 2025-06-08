import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import Divider from "../../components/Resuables/Divider";
import Navigator from "./Frontpage.Page.Navigator";
import ordersImageUrl from "../../images/_a8b86e0e-c47a-4490-89ed-e2b2a69dcc61-removebg-preview.png";
import productsImageUrl from "../../images/_045d1801-1987-4ce3-abd9-1b8f56fcde24-removebg-preview.png";
import productHistoriesImageUrl from "../../images/_4766e2d9-54f8-48b5-9366-11485ac2198b-removebg-preview.png";
import contentGridDirective from "../../directives/contentGridDirective";
import LinkBoxV2 from "../../components/Resuables/LinkBoxV2";

export default function FrontpagePage() {
    return (
        <MixinPage directives={[contentGridDirective(() => ({}))]} exp={(options) => ({ size: options.SIZE.BASE })}>
            <h1 className="hidden">Frontpage</h1>
            <MixinPageSection className="flex flex-row gap-3 items-center justify-between">
                <LinkBoxV2 exp={(routes) => routes.FRONTPAGE} params={{}} />
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="grid grid-cols-2 max-[576px]:grid-cols-2 max-[445px]:grid-cols-1 gap-3">
                <Navigator
                    title="Products"
                    imageUrl={productsImageUrl}
                    buttons={[
                        { label: "List", href: "/products" },
                        { label: "Create", href: "/products/create" },
                    ]}
                />
                <Navigator
                    title="Orders"
                    imageUrl={ordersImageUrl}
                    buttons={[
                        { label: "List", href: "/orders" },
                        { label: "Create", href: "/orders/create" },
                    ]}
                />
                <Navigator title="Product Histories" imageUrl={productHistoriesImageUrl} buttons={[{ label: "List", href: "/product_histories" }]} />
            </MixinPageSection>
        </MixinPage>
    );
}
