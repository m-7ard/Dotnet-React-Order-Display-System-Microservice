import { InputHTMLAttributes } from "react";

export type IStatelessRadioCheckboxFieldProps = {
    name: string;
    value: string;
    onChange: (value: string) => void;
    checked: boolean;
    label?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "onChange" | "value" | "name">;

function StatelessRadioCheckboxField(props: IStatelessRadioCheckboxFieldProps) {
    const { name, value, onChange, checked, label, id, "aria-describedby": describedBy, ...htmlProps } = props;
    
    // Generate unique ID for this radio option
    const radioId = id ? id : `${name}-${value}`;

    return (
        <div className={["mixin-checkbox-like mixin-checkbox-sm theme-checkbox-generic-white"].join(" ")}>
            <div data-role="inner-part"></div>
            <input
                id={radioId}
                name={name}
                value={value}
                type="radio"
                checked={checked}
                onChange={() => {
                    onChange(value);
                }}
                aria-describedby={describedBy}
                aria-invalid={describedBy ? "true" : "false"}
                {...htmlProps}
            />
            {label && (
                <label 
                    htmlFor={radioId}
                    className="ml-2 text-sm cursor-pointer"
                >
                    {label}
                </label>
            )}
        </div>
    );
}

export default StatelessRadioCheckboxField;