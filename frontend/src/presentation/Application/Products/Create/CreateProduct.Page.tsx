import FormField from "../../../components/Forms/FormField";
import StatelessTextArea from "../../../components/StatelessFields/TextArea/StatelessTextArea";
import MixinButton from "../../../components/Resuables/MixinButton/MixinButton";
import { ErrorState, ValueState } from "./CreateProduct.Controller";
import { useCallback } from "react";
import MixinPage, { MixinPageSection } from "../../../components/Resuables/MixinPage";
import Divider from "../../../components/Resuables/Divider";
import FormError from "../../../components/Forms/FormError";
import contentGridDirective from "../../../directives/contentGridDirective";
import LinkBoxV2 from "../../../components/Resuables/LinkBoxV2";
import FormFieldStatelessCharField from "../../../components/StatelessFields/CharField/Variants/FormFieldStatelessCharField";
import FormFieldImageUploadForm from "../../../components/Forms/ImageUploadForm/Variants/FormFieldUploadImagesForm";

export default function CreateProductPage(props: {
    value: ValueState;
    errors: ErrorState;
    onSubmit: () => void;
    onReset: () => void;
    onChange: (value: ValueState) => void;
    uploadImages: (images: File[]) => Promise<void>;
}) {
    const { value, errors, onSubmit, onReset, onChange, uploadImages } = props;

    const updateField = useCallback(
        <K extends keyof ValueState>(fieldName: K, fieldValue: ValueState[K]) => {
            const newValue = { ...value };
            newValue[fieldName] = fieldValue;
            onChange(newValue);
        },
        [onChange, value],
    );

    return (
        <MixinPage
            as="form"
            onSubmit={(e) => {
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
                <LinkBoxV2 exp={(routes) => routes.CREATE_PRODUCT} params={{}} />
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-col gap-3">
                <div className="token-default-title">Create Product</div>
                <FormError title="Failed to Create Product" errors={errors._} />
                <div className="flex flex-col gap-4">
                    <FormField name="name" errors={errors.name}>
                        <FormFieldStatelessCharField
                            onChange={(value) => updateField("name", value)}
                            value={value.name}
                            options={{
                                size: "mixin-char-input-base",
                                theme: "theme-input-generic-white",
                            }}
                        />
                    </FormField>
                    <FormField name="images" errors={errors.images?._}>
                        <FormFieldImageUploadForm onSubmit={uploadImages} onChange={(value) => updateField("images", value)} errors={errors.images} value={value.images} />
                    </FormField>
                    <FormField name="price" errors={errors.price}>
                        <FormFieldStatelessCharField
                            onChange={(value) => updateField("price", value)}
                            value={value.price.toString()}
                            options={{
                                size: "mixin-char-input-base",
                                theme: "theme-input-generic-white",
                            }}
                        />
                    </FormField>
                    <FormField name="description" errors={errors.description}>
                        <StatelessTextArea
                            onChange={(value) => updateField("description", value)}
                            value={value.description}
                            options={{
                                size: "mixin-textarea-any",
                                theme: "theme-textarea-generic-white",
                            }}
                            rows={5}
                            maxLength={1028}
                        />
                    </FormField>
                    <FormField name="amount" errors={errors.amount}>
                        <FormFieldStatelessCharField
                            onChange={(value) => updateField("amount", value)}
                            value={value.amount}
                            options={{
                                size: "mixin-char-input-base",
                                theme: "theme-input-generic-white",
                            }}
                        />
                    </FormField>
                </div>
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
