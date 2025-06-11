import { InputHTMLAttributes } from "react";

export type IStatelessBooleanCheckboxProps = {
    value: boolean;
    onChange: (value: boolean) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "onChange" | "value">;

function StatelessBooleanCheckbox(props: IStatelessBooleanCheckboxProps) {
    const { value, onChange, id, "aria-describedby": describedBy, ...htmlProps } = props;

    return (
        <div className={["mixin-checkbox-like mixin-checkbox-sm theme-checkbox-generic-white"].join(" ")}>
            <input
                type="checkbox"
                checked={value ?? false}
                onChange={({ target: { checked } }) => {
                    onChange(checked);
                }}
                id={id}
                aria-describedby={describedBy}
                aria-invalid={describedBy ? "true" : "false"}
                {...htmlProps}
            />
        </div>
    );
}

export default StatelessBooleanCheckbox;
