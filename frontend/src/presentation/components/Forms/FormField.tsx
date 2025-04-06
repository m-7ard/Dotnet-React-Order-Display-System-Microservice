import React from "react";
import generateLabel from "../../utils/generateLabel";

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
    children: React.ReactNode | ((props: { name: T; }) => React.ReactNode)
}) {
    return (
        <div className="flex flex-col gap-y-1">
            {row ?? false ? (
                <div className="flex flex-row gap-3 items-center">
                    {typeof children === "function" ? children({ name }) : children}
                    <div className="text-sm font-medium">{label ?? generateLabel(name)}</div>
                </div>
            ) : (
                <>
                    <div className="text-sm font-medium leading-none">{label ?? generateLabel(name)}</div>
                    {typeof children === "function" ? children({ name }) : children}
                </>
            )}
            {errors == null ? null : (
                <div className="flex flex-col gap-0.5">
                    {errors.map((message) => (
                        <div className="text-xs text-red-700" key={message}>
                            {message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
