import { useCallback } from "react";
import FormField from "../Forms/FormField";
import StatelessCharField from "../StatelessFields/StatelessCharField";
import StatelessTextArea from "../StatelessFields/StatelessTextArea";

export type FilterProductHistoriesFieldsetValueState = {
    name: string;
    minPrice: string;
    maxPrice: string;
    description: string;
    validFrom: string;
    validTo: string;
    productId: string;
};

export default function FilterProductHistoriesFieldset(props: {
    value: FilterProductHistoriesFieldsetValueState;
    onChange: (value: FilterProductHistoriesFieldsetValueState) => void;
}) {
    const { value, onChange } = props;

    const updateField = useCallback(<K extends keyof FilterProductHistoriesFieldsetValueState>(fieldName: K, fieldValue: FilterProductHistoriesFieldsetValueState[K]) => {
        const newValue = {...value};
        newValue[fieldName] = fieldValue;
        onChange(newValue);
    }, [onChange, value]);


    return (
        <>
            <FormField name="name">
                {({ name }) => (
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={value[name]}
                        onChange={(value) => updateField(name, value)}
                    />
                )}
            </FormField>
            <div className="flex flex-row gap-3">
                <div className="basis-1/2">
                    <FormField name="minPrice">
                        {({ name }) => (
                            <StatelessCharField
                                options={{
                                    size: "mixin-char-input-base",
                                    theme: "theme-input-generic-white",
                                }}
                                value={value[name]}
                                onChange={(value) => updateField(name, value)}
                            />
                        )}
                    </FormField>
                </div>
                <div className="basis-1/2">
                    <FormField name="maxPrice">
                        {({ name }) => (
                            <StatelessCharField
                                options={{
                                    size: "mixin-char-input-base",
                                    theme: "theme-input-generic-white",
                                }}
                                value={value[name]}
                                onChange={(value) => updateField(name, value)}
                            />
                        )}
                    </FormField>
                </div>
            </div>
            <FormField name="description">
                {({ name }) => (
                    <StatelessTextArea
                        onChange={(value) => updateField(name, value)}
                        value={value[name]}
                        options={{
                            size: "mixin-textarea-any",
                            theme: "theme-textarea-generic-white",
                        }}
                        rows={5}
                        maxLength={1028}
                    />
                )}
            </FormField>
            <FormField name="validTo">
                {({ name }) => (
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={value[name]}
                        type="date"
                        onChange={(value) => updateField(name, value)}
                    />
                )}
            </FormField>
            <FormField name="validFrom">
                {({ name }) => (
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={value[name]}
                        type="date"
                        onChange={(value) => updateField(name, value)}
                    />
                )}
            </FormField>
            <FormField name="productId">
                {({ name }) => (
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={value[name]}
                        onChange={(value) => updateField(name, value)}
                    />
                )}
            </FormField>
        </>
    );
}
