import FormField from "../../../components/Forms/FormField";
import OrderItemDataField from "../../../components/OrderItemDataForm/OrderItemData.Field";
import MixinButton from "../../../components/Resuables/MixinButton";
import { useCallback } from "react";
import Divider from "../../../components/Resuables/Divider";
import FormError from "../../../components/Forms/FormError,";
import MixinPage, { MixinPageSection } from "../../../components/Resuables/MixinPage";
import { ErrorState, ValueSchema } from "./CreateOrder.Controller";
import contentGridDirective from "../../../directives/contentGridDirective";
import LinkBoxV2 from "../../../components/Resuables/LinkBoxV2";

export default function CreateOrderPage(props: {
    onSubmit: () => void;
    onReset: () => void;
    onChange: (value: ValueSchema) => void;
    errors: ErrorState;
    value: ValueSchema;
}) {
    const { onSubmit, onReset, errors, value, onChange } = props;

    const updateField = useCallback(
        <T extends keyof ValueSchema>(fieldName: T, fieldValue: ValueSchema[T]) => {
            const newFormValue = { ...value };
            newFormValue[fieldName] = fieldValue;
            onChange(newFormValue);
        },
        [onChange, value],
    );

    return (
        <MixinPage
            as="form"
            onSubmit={async (e) => {
                e.preventDefault();
                onSubmit();
            }}
            onReset={(e) => {
                e.preventDefault();
                onReset();
            }}
            exp={(options) => ({ size: options.SIZE.BASE })}
            directives={[contentGridDirective(() => ({}))]}
        >
            <MixinPageSection className="flex flex-row gap-3 items-center">
                <LinkBoxV2 exp={(routes) => routes.CREATE_ORDER} params={{}} />
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-col gap-3">
                <div className="token-default-title">Create Order</div>
                <FormError title="Failed to Create Order" errors={errors._} />
                <FormField name="orderItemData" errors={errors.orderItemData?._}>
                    <OrderItemDataField
                        value={value.orderItemData}
                        errors={errors.orderItemData}
                        onChange={(value) => {
                            updateField("orderItemData", value);
                        }}
                    />
                </FormField>
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-row gap-3 justify-end">
                <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="reset">
                    Reset
                </MixinButton>
                <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }} type="submit">
                    Submit
                </MixinButton>
            </MixinPageSection>
        </MixinPage>
    );
}
