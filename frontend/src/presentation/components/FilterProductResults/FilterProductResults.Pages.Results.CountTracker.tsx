import IProduct from "../../../domain/models/IProduct";
import CoverImage from "../Resuables/CoverImage";
import MixinButton from "../Resuables/MixinButton/MixinButton";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";

type CountTrackerProductProps = { product: IProduct; onAdd: () => void; quantity: number | null; };

export default function CountTrackerProduct(props: CountTrackerProductProps) {
    const { product, onAdd, quantity } = props;
    const productImages = product.images.map((image) => `${image.url}`);

    const isAdded = quantity != null;

    return (
        <MixinPrototypeCard options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }} hasBorder hasShadow hasDivide>
            <MixinPrototypeCardSection className="grid gap-3" style={{ gridTemplateColumns: "auto 1fr" }}>
                <CoverImage className="token-default-avatar" src={productImages[0]} alt={`Product ${product.id} thumbnail`}/>
                <div className="overflow-hidden">
                    <div className="text-base font-bold truncate">
                        {product.name}
                    </div>
                    <div className="text-sm truncate">${product.price}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection>
                <div className="flex flex-row gap-3">
                    <div className="text-xs font-bold">Date Created</div>
                    <div className="text-xs truncate">{product.dateCreated.toLocaleString("en-us")}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-row gap-3">
                {isAdded ? (
                    <>
                        <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} isStatic type="button">
                            x{quantity}
                        </MixinButton>
                        <MixinButton className="grow justify-center" options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }} type="button">
                            Already Added
                        </MixinButton>
                    </>
                ) : (
                    <MixinButton className="grow justify-center" options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }} onClick={onAdd} type="button">
                        Add Item
                    </MixinButton>
                )}
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
