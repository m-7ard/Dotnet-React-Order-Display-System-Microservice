import { HTMLProps } from "react";

export interface IStatelessCharFieldProps extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> {
    value: string;
    options: {
        size: "mixin-char-input-sm" | "mixin-char-input-base";
        theme: "theme-input-generic-white";
    };
    onChange: (value: IStatelessCharFieldProps["value"]) => void;
}

function StatelessCharField(props: IStatelessCharFieldProps) {
    const { value, options, onChange, id, "aria-describedby": ariaDescribedby, ...htmlProps } = props;

    return (
        <div className={["mixin-char-input-like", options.size, options.theme].join(" ")}>
            <input
                value={value ?? ""}
                onChange={({ target: { value } }) => {
                    onChange(value);
                }}
                id={id}
                aria-describedby={ariaDescribedby}
                aria-invalid={ariaDescribedby ? "true" : "false"}
                {...htmlProps}
            />
        </div>
    );
}

export default StatelessCharField;