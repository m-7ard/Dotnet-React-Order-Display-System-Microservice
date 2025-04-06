import { HTMLProps } from "react";

interface IStatelsssCharFieldProps extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> {
    value: string;
    options: {
        size: "mixin-char-input-sm" | "mixin-char-input-base";
        theme: "theme-input-generic-white";
    };
    onChange: (value: IStatelsssCharFieldProps["value"]) => void;
}

function StatelessCharField (props: IStatelsssCharFieldProps) {
    const { value, options, onChange, ...htmlProps } = props;

    return (
        <div className={["mixin-char-input-like", options.size, options.theme].join(" ")}>
            <input
                value={value ?? ""}
                onChange={({ target: { value } }) => {
                    onChange(value);
                }}
                {...htmlProps}
            ></input>
        </div>
    );
}

export default StatelessCharField;
