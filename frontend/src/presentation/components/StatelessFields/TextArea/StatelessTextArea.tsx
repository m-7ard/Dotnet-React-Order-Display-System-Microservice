import { TextareaHTMLAttributes } from "react";

export interface IStatelessTextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
    value: string;
    options: {
        size: "mixin-textarea-any";
        theme: "theme-textarea-generic-white";
    };
    onChange: (value: IStatelessTextAreaProps["value"]) => void;
}

function StatelessTextArea(props: IStatelessTextAreaProps) {
    const { value, options, onChange, maxLength, id, "aria-describedby": describedBy, ...htmlProps } = props;
    
    // Generate unique ID for character counter
    const counterId = id ? `${id}-counter` : undefined;
    
    // Combine aria-describedby from FormField context and character counter
    const ariaDescribedBy = [describedBy, counterId]
        .filter(Boolean)
        .join(' ') || undefined;

    const hasMaxLength = maxLength != null;
    const remainingChars = hasMaxLength ? maxLength - value.length : 0;
    const isNearLimit = hasMaxLength && remainingChars <= 10;
    const isOverLimit = hasMaxLength && remainingChars < 0;

    return (
        <div className={`${options.size} ${options.theme}`}>
            <textarea
                value={value}
                onChange={({ target: { value } }) => onChange(value)}
                id={id}
                aria-describedby={ariaDescribedBy}
                aria-invalid={describedBy ? "true" : "false"}
                {...htmlProps}
            />
            {hasMaxLength && (
                <footer data-role="footer">
                    <div 
                        id={counterId}
                        data-role="counter"
                        aria-live="polite"
                        aria-atomic="true"
                        className={isOverLimit ? "text-red-600" : isNearLimit ? "text-yellow-600" : ""}
                    >
                        <span className="sr-only">
                            {isOverLimit 
                                ? `${Math.abs(remainingChars)} characters over limit` 
                                : `${remainingChars} characters remaining`
                            }
                        </span>
                        <span aria-hidden="true">
                            {value.length} / {maxLength}
                        </span>
                    </div>
                </footer>
            )}
        </div>
    );
}

export default StatelessTextArea;