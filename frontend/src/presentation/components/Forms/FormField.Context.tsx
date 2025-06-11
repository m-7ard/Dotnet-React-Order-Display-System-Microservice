import createSafeContext from "../../utils/createSafeContext";

export const [FormFieldContext, useFormFieldContext] = createSafeContext<{
    id: string;
    describedBy?: string;
}>("useFormFieldContext must be used within FormFieldContext.Provider.");
