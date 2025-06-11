import { useCallback } from "react";
import OrderStatus from "../../../domain/valueObjects/Order/OrderStatus";
import FormField from "../Forms/FormField";
import StatelessCharField from "../StatelessFields/CharField/StatelessCharField";
import StatelessListBox from "../StatelessFields/StatelessListBox";

export type FilterOrdersFieldsetValueState = {
    id: string;
    minTotal: string;
    maxTotal: string;
    status: string;
    createdBefore: string;
    createdAfter: string;
    productId: string;
    productHistoryId: string;
    orderSerialNumber: string;
    orderItemSerialNumber: string;
};

export default function FilterOrdersFieldset(props: {
    value: FilterOrdersFieldsetValueState;
    onChange: (value: FilterOrdersFieldsetValueState) => void;
}) {
    const { value, onChange } = props;
    
    const updateField = useCallback(<K extends keyof FilterOrdersFieldsetValueState>(fieldName: K, fieldValue: FilterOrdersFieldsetValueState[K]) => {
        const newValue = {...value};
        newValue[fieldName] = fieldValue;
        onChange(newValue);
    }, [onChange, value]);

    return (
        <>
            <FormField name="id">
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
                    <FormField name="minTotal">
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
                    <FormField name="maxTotal">
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
            <FormField name="status">
                {({ name }) => (
                    <StatelessListBox
                        nullable
                        onChange={(value) => {
                            updateField(name, value == null ? "" : value.toString());
                        }}
                        value={value[name]}
                        choices={[
                            {
                                value: OrderStatus.FINISHED.value,
                                label: OrderStatus.FINISHED.value,
                            },
                            {
                                value: OrderStatus.PENDING.value,
                                label: OrderStatus.PENDING.value,
                            },
                        ]}
                    />
                )}
            </FormField>
            <FormField name="createdBefore">
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
            <FormField name="createdAfter">
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
            <FormField name="productHistoryId">
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
            <FormField name="orderSerialNumber">
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
            <FormField name="orderItemSerialNumber">
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
