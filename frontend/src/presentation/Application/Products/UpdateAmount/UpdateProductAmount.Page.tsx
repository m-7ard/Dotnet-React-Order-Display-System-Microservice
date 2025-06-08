import StatelessCharField from "../../../components/StatelessFields/CharField/StatelessCharField";
import FormField from "../../../components/Forms/FormField";
import MixinButton from "../../../components/Resuables/MixinButton";
import { useCallback } from "react";
import { ErrorSchema, ValueSchema } from "./UpdateProductAmount.Controller";
import IProduct from "../../../../domain/models/IProduct";
import MixinPage, { MixinPageSection } from "../../../components/Resuables/MixinPage";
import Divider from "../../../components/Resuables/Divider";
import contentGridDirective from "../../../directives/contentGridDirective";
import LinkBoxV2 from "../../../components/Resuables/LinkBoxV2";

export default function UpdateProductAmountPage(props: {
    value: ValueSchema;
    onChange: (value: ValueSchema) => void;
    onReset: () => void;
    onSubmit: () => void;
    errors: ErrorSchema;
    product: IProduct;
}) {
    const { value, onChange, onReset, onSubmit, errors, product } = props;

    const updateField = useCallback(
        <K extends keyof ValueSchema>(fieldName: K, fieldValue: ValueSchema[K]) => {
            const newValue = { ...value };
            newValue[fieldName] = fieldValue;
            onChange(newValue);
        },
        [onChange, value],
    );

    return (
        <MixinPage
            as="form"
            directives={[contentGridDirective(() => ({}))]}
            exp={(options) => ({ size: options.SIZE.BASE })}
            onSubmit={async (e) => {
                e.preventDefault();
                onSubmit();
            }}
            onReset={(e) => {
                e.preventDefault();
                onReset();
            }}
        >
            <MixinPageSection className="flex flex-row gap-3 items-center">
                <LinkBoxV2 exp={(routes) => routes.UPDATE_PRODUCT_AMOUNT} params={{ id: product.id }} />
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-col gap-3">
                <FormField name="amount" errors={errors.amount}>
                    <StatelessCharField
                        onChange={(value) => updateField("amount", value)}
                        value={value.amount.toString()}
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                    />
                </FormField>
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-row gap-3 justify-end">
                <MixinButton className="  overflow-hidden" options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="reset">
                    Reset
                </MixinButton>
                <MixinButton className="  overflow-hidden" options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }} type="submit">
                    Submit
                </MixinButton>
            </MixinPageSection>
        </MixinPage>
    );
}
