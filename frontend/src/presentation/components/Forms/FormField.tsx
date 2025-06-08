import React from "react";
import generateLabel from "../../utils/generateLabel";
import { FormFieldContext } from "./FormField.Context";

export default function FormField<T extends string>({
    errors,
    name,
    label,
    row = false,
    children,
}: {
    errors?: string[];
    name: T;
    label?: string;
    row?: boolean;
    children: React.ReactNode | ((props: { name: T }) => React.ReactNode);
}) {
    const fieldId = name;
    const errorId = errors?.length ? `${fieldId}-error` : undefined;
    const finalLabel = label ?? generateLabel(name);

    const fieldContent = (
        <FormFieldContext.Provider value={{ id: fieldId, describedBy: errorId }}>{typeof children === "function" ? children({ name }) : children}</FormFieldContext.Provider>
    );

    return (
        <div className="flex flex-col gap-y-1">
            {row ? (
                <div className="flex flex-row gap-3 items-center">
                    {fieldContent}
                    <label htmlFor={fieldId} className="text-sm font-medium">
                        {finalLabel}
                    </label>
                </div>
            ) : (
                <>
                    <label htmlFor={fieldId} className="text-sm font-medium leading-none">
                        {finalLabel}
                    </label>
                    {fieldContent}
                </>
            )}
            {errors?.length ? (
                <div className="flex flex-col gap-0.5" id={errorId} role="alert" aria-live="polite">
                    {errors.map((message, index) => (
                        <div className="text-xs text-red-700" key={index}>
                            {message}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
