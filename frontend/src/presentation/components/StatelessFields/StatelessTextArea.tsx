import { TextareaHTMLAttributes } from "react";

interface IStatelsssTextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
    value: string;
    options: {
        size: "mixin-textarea-any";
        theme: "theme-textarea-generic-white";
    };
    onChange: (value: IStatelsssTextAreaProps["value"]) => void;
}

function StatelessTextArea (props: IStatelsssTextAreaProps) {
    const { value, options, onChange, ...htmlProps } = props;

    return (
        <div className={`${options.size} ${options.theme}`}>
            <textarea
                value={value}
                onChange={({ target: { value } }) => onChange(value)}
                {...htmlProps}
            />
            {props.maxLength != null && (
                <footer data-role="footer">
                    <div data-role="counter">
                        {value.length} / {props.maxLength}
                    </div>
                </footer>
            )}
        </div>
    );
}

export default StatelessTextArea;
