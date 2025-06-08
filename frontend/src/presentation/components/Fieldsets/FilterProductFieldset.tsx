import { useCallback } from "react";
import FormField from "../Forms/FormField";
import StatelessTextArea from "../StatelessFields/TextArea/StatelessTextArea";
import FormFieldStatelessCharField from "../StatelessFields/CharField/Variants/FormFieldStatelessCharField";

export type FilterProductsFieldsetValueState = {
    id: string;
    name: string;
    minPrice: string;
    maxPrice: string;
    description: string;
    createdAfter: string;
    createdBefore: string;
};

export default function FilterProductsFieldset(props: { value: FilterProductsFieldsetValueState; onChange: (value: FilterProductsFieldsetValueState) => void }) {
    const { value, onChange } = props;

    const updateField = useCallback(
        <K extends keyof FilterProductsFieldsetValueState>(fieldName: K, fieldValue: FilterProductsFieldsetValueState[K]) => {
            const newValue = { ...value };
            newValue[fieldName] = fieldValue;
            onChange(newValue);
        },
        [onChange, value],
    );

    return (
        <>
            <FormField name="id">
                <FormFieldStatelessCharField
                    options={{
                        size: "mixin-char-input-base",
                        theme: "theme-input-generic-white",
                    }}
                    value={value.id}
                    onChange={(value) => updateField("id", value)}
                />
            </FormField>
            <FormField name="name">
                <FormFieldStatelessCharField
                    options={{
                        size: "mixin-char-input-base",
                        theme: "theme-input-generic-white",
                    }}
                    value={value.name}
                    onChange={(value) => updateField("name", value)}
                />
            </FormField>
            <div className="flex flex-row gap-3">
                <div className="basis-1/2">
                    <FormField name="minPrice">
                        <FormFieldStatelessCharField
                            options={{
                                size: "mixin-char-input-base",
                                theme: "theme-input-generic-white",
                            }}
                            value={value.minPrice}
                            onChange={(value) => updateField("minPrice", value)}
                        />
                    </FormField>
                </div>
                <div className="basis-1/2">
                    <FormField name="maxPrice">
                        <FormFieldStatelessCharField
                            options={{
                                size: "mixin-char-input-base",
                                theme: "theme-input-generic-white",
                            }}
                            value={value.maxPrice}
                            onChange={(value) => updateField("maxPrice", value)}
                        />
                    </FormField>
                </div>
            </div>
            <FormField name="description">
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
            <FormField name="createdBefore">
                <FormFieldStatelessCharField
                    options={{
                        size: "mixin-char-input-base",
                        theme: "theme-input-generic-white",
                    }}
                    value={value.createdBefore}
                    type="date"
                    onChange={(value) => updateField("createdBefore", value)}
                />
            </FormField>
            <FormField name="createdAfter">
                <FormFieldStatelessCharField
                    options={{
                        size: "mixin-char-input-base",
                        theme: "theme-input-generic-white",
                    }}
                    value={value.createdAfter}
                    type="date"
                    onChange={(value) => updateField("createdAfter", value)}
                />
            </FormField>
        </>
    );
}
