import { Type } from "@sinclair/typebox";
import IPresentationError from "../../interfaces/IPresentationError";
import IProduct from "../../../domain/models/IProduct";
import CoverImage from "../Resuables/CoverImage";
import MixinButton from "../Resuables/MixinButton";
import StatelessCharField from "../StatelessFields/StatelessCharField";
import { Value } from "@sinclair/typebox/value";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";
import FormField from "../Forms/FormField";
import FormError from "../Forms/FormError,";

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

    return (
        <MixinPrototypeCard
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
            hasBorder
            hasDivide
        >
            <MixinPrototypeCardSection className="grid gap-3" style={{ gridTemplateColumns: "auto 1fr" }}>
                <CoverImage className="token-default-avatar" src={productImages[0]} />
                <div className="overflow-hidden">
                    <div className="token-card--header--primary-text truncate" title={product.name}>
                        {product.name}
                    </div>
                    <div className="token-card--header--secondary-text truncate">${product.price}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-col gap-3">
                <FormError title="Failed to Create Order Item" errors={errors?._} />
                <FormField name="quantity" errors={errors?.quantity}>
                    <div className="flex flex-row gap-3 grow">
                        <MixinButton
                            options={{
                                size: "mixin-button-base",
                                theme: "theme-button-generic-green",
                            }}
                            type="button"
                            onClick={() => updateQuantity(value.quantity + 1)}
                        >
                            +
                        </MixinButton>
                        <StatelessCharField
                            options={{
                                size: "mixin-char-input-base",
                                theme: "theme-input-generic-white",
                            }}
                            value={value.quantity.toString()}
                            onChange={(value) => updateQuantity(parseInt(value))}
                            className="flex grow"
                        />
                        <MixinButton
                            options={{
                                size: "mixin-button-base",
                                theme: "theme-button-generic-red",
                            }}
                            type="button"
                            onClick={() => updateQuantity(value.quantity - 1)}
                        >
                            -
                        </MixinButton>
                    </div>
                </FormField>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection>
                <MixinButton className="justify-center w-full" type="button" onClick={onDelete} options={{ size: "mixin-button-base", theme: "theme-button-generic-red" }}>
                    Remove Item
                </MixinButton>
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
