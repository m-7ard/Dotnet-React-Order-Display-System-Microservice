import FormField from "../../../components/Forms/FormField";
import MixinButton from "../../../components/Resuables/MixinButton";
import { ErrorState, ValueState } from "./RegisterUser.Controller";
import { useCallback } from "react";
import MixinPage, { MixinPageSection } from "../../../components/Resuables/MixinPage";
import Divider from "../../../components/Resuables/Divider";
import FormError from "../../../components/Forms/FormError,";
import contentGridDirective from "../../../directives/contentGridDirective";
import LinkBoxV2 from "../../../components/Resuables/LinkBoxV2";
import FormFieldStatelessCharField from "../../../components/StatelessFields/CharField/Variants/FormFieldStatelessCharField";

export default function RegisterUserPage(props: {
    value: ValueState;
    errors: ErrorState;
    onSubmit: () => void;
    onReset: () => void;
    onChange: (value: ValueState) => void;
}) {
    const { value, errors, onSubmit, onReset, onChange } = props;

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
                <LinkBoxV2 exp={(routes) => routes.REGISTER_USER} params={{}} />
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-col gap-3">
                <div className="token-default-title">Register User</div>
                <FormError title="Failed to Register User" errors={errors._} />
                <div className="flex flex-col gap-4">
                    <FormField name="username" errors={errors.username}>
                        <FormFieldStatelessCharField
                            onChange={(value) => updateField("username", value)}
                            value={value.username}
                            options={{
                                size: "mixin-char-input-base",
                                theme: "theme-input-generic-white",
                            }}
                        />
                    </FormField>
                    <FormField name="email" errors={errors.email}>
                        <FormFieldStatelessCharField
                            onChange={(value) => updateField("email", value)}
                            value={value.email}
                            options={{
                                size: "mixin-char-input-base",
                                theme: "theme-input-generic-white",
                            }}
                            type="email"
                        />
                    </FormField>
                    <FormField name="password" errors={errors.password}>
                        <FormFieldStatelessCharField
                            onChange={(value) => updateField("password", value)}
                            value={value.password}
                            options={{
                                size: "mixin-char-input-base",
                                theme: "theme-input-generic-white",
                            }}
                            type="password"
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
