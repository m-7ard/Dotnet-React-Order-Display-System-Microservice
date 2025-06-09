import IProduct from "../../../domain/models/IProduct";
import CoverImage from "../../components/Resuables/CoverImage";
import MixinButton from "../../components/Resuables/MixinButton";
import ProductOptionMenu from "./Products.Page.Product.OptionsMenu";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/renderAbstractTooltip/AbstractTooltip";
import { useRouterNavigate } from "../../routes/RouterModule/RouterModule.hooks";

export default function ProductElement(props: { product: IProduct }) {
    const { product } = props;
    const productImages = product.images.map((image) => `${image.url}`);
    const navigate = useRouterNavigate();

    return (
        <MixinPrototypeCard
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
            hasDivide
            hasShadow
        >
            <MixinPrototypeCardSection className="grid gap-3" style={{ gridTemplateColumns: "auto 1fr" }}>
                <CoverImage className="token-default-avatar" src={productImages[0]} alt={`Product ${product.id} thumbnail`} />
                <div className="overflow-hidden">
                    <div className="token-card--header--primary-text truncate">
                        {product.name}
                    </div>
                    <div className="token-card--header--secondary-text truncate">${product.price}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection>
                <div className="token-default-list">
                    <div className="token-default-list__label">Date Created</div>
                    <div className="token-default-list__value truncate">{product.dateCreated.toLocaleString("en-us")}</div>
                </div>
                <div className="token-default-list">
                    <div className="token-default-list__label">Amount</div>
                    <div className="token-default-list__value truncate">{product.amount}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-col gap-1">
                <a
                    className="w-full"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate({ exp: (routes) => routes.LIST_ORDERS, params: {}, search: { productId: product.id } });
                    }}
                >
                    <MixinButton className="w-full justify-center truncate" type="button" options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }}>
                        See Orders
                    </MixinButton>
                </a>
                <AbstractTooltip
                    Trigger={({ open, onToggle }) => (
                        <AbstractTooltipTrigger>
                            <MixinButton
                                className="justify-center truncate items-center w-full"
                                type="button"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                                onClick={onToggle}
                                active={open}
                            >
                                Other
                            </MixinButton>
                        </AbstractTooltipTrigger>
                    )}
                    Panel={() => <ProductOptionMenu product={product} />}
                    positioning={{ top: "100%", left: "0px", right: "0px" }}
                />
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
