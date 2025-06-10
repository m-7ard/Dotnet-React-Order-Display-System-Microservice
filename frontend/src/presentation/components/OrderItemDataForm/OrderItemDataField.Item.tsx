import { Type } from "@sinclair/typebox";
import IPresentationError from "../../interfaces/IPresentationError";
import IProduct from "../../../domain/models/IProduct";
import CoverImage from "../Resuables/CoverImage";
import MixinButton from "../Resuables/MixinButton";
import { Value } from "@sinclair/typebox/value";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";
import FormField from "../Forms/FormField";
import FormError from "../Forms/FormError";
import FormFieldStatelessCharField from "../StatelessFields/CharField/Variants/FormFieldStatelessCharField";

export type ValueSchema = {
    product: IProduct;
    quantity: number;
};

export type ErrorSchema = IPresentationError<{
    product: string[];
    quantity: string[];
}>;

export type OrderItemDataFormProps = {
    onUpdate: (value: ValueSchema) => void;
    onDelete: () => void;
    product: IProduct;
    errors?: ErrorSchema;
    value: ValueSchema;
};

export default function OrderItemDataFieldItem(props: OrderItemDataFormProps) {
    const { onUpdate, onDelete, product, value, errors } = props;
    const productImages = product.images.map((image) => `${image.url}`);

    const updateQuantity = (quantity: number) => {
        const isValid = Value.Check(Type.Integer({ minimum: 1 }), quantity);
        const newValue = { ...value };
        newValue.quantity = isValid ? quantity : 1;
        onUpdate(newValue);
    };

    const quantityFieldId = `quantity-${product.id}`;
    const decreaseId = `decrease-${product.id}`;
    const increaseId = `increase-${product.id}`;
    
    return (
        <article role="group" aria-labelledby={`product-name-${product.id}`} aria-describedby={`product-price-${product.id}`}>
            <MixinPrototypeCard
                options={{
                    size: "mixin-Pcard-base",
                    theme: "theme-Pcard-generic-white",
                }}
                hasBorder
                hasDivide
            >
                {/* Product Info Section */}
                <MixinPrototypeCardSection className="grid gap-3" style={{ gridTemplateColumns: "auto 1fr" }}>
                    <CoverImage className="token-default-avatar" src={productImages[0]} alt={`Product "${product.name}"'s thumbnail`} />
                    <div className="overflow-hidden">
                        <div id={`product-name-${product.id}`} className="token-card--header--primary-text truncate">
                            {product.name}
                        </div>
                        <div id={`product-price-${product.id}`} className="token-card--header--secondary-text truncate" aria-label={`Price: $${product.price}`}>
                            ${product.price}
                        </div>
                    </div>
                </MixinPrototypeCardSection>

                {/* Quantity Control Section */}
                <MixinPrototypeCardSection className="flex flex-col gap-3">
                    <FormError title="Failed to Create Order Item" errors={errors?._} />

                    <FormField name="quantity" errors={errors?.quantity} label="Quantity">
                        <div className="flex flex-row gap-3 grow" role="group" aria-labelledby={`quantity-label-${product.id}`}>
                            <label id={`quantity-label-${product.id}`} className="sr-only">
                                Quantity for {product.name}
                            </label>

                            <MixinButton
                                id={decreaseId}
                                options={{
                                    size: "mixin-button-base",
                                    theme: "theme-button-generic-red",
                                }}
                                type="button"
                                onClick={() => updateQuantity(value.quantity - 1)}
                                aria-label={`Decrease quantity for ${product.name}`}
                                aria-describedby={quantityFieldId}
                                disabled={value.quantity <= 1}
                                aria-disabled={value.quantity <= 1}
                            >
                                <span aria-hidden="true">-</span>
                            </MixinButton>

                            <FormFieldStatelessCharField
                                id={quantityFieldId}
                                options={{
                                    size: "mixin-char-input-base",
                                    theme: "theme-input-generic-white",
                                }}
                                value={value.quantity.toString()}
                                onChange={(value) => updateQuantity(parseInt(value) || 1)}
                                className="flex grow"
                                aria-label={`Quantity for ${product.name}`}
                                aria-describedby={`${decreaseId} ${increaseId}`}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                min="1"
                                step="1"
                            />

                            <MixinButton
                                id={increaseId}
                                options={{
                                    size: "mixin-button-base",
                                    theme: "theme-button-generic-green",
                                }}
                                type="button"
                                onClick={() => updateQuantity(value.quantity + 1)}
                                aria-label={`Increase quantity for ${product.name}`}
                                aria-describedby={quantityFieldId}
                            >
                                <span aria-hidden="true">+</span>
                            </MixinButton>
                        </div>
                    </FormField>
                </MixinPrototypeCardSection>

                {/* Remove Item Section */}
                <MixinPrototypeCardSection>
                    <MixinButton
                        className="justify-center w-full"
                        type="button"
                        onClick={onDelete}
                        options={{
                            size: "mixin-button-base",
                            theme: "theme-button-generic-red",
                        }}
                        aria-label={`Remove ${product.name} from order`}
                        aria-describedby={`product-price-${product.id}`}
                    >
                        <span aria-hidden="true">Remove Item</span>
                    </MixinButton>
                </MixinPrototypeCardSection>
            </MixinPrototypeCard>
        </article>
    );
}
