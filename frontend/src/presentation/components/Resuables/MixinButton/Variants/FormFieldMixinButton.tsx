import { ElementType } from "react";
import { useFormFieldContext } from "../../../Forms/FormField.Context";
import MixinButton, { PolymorphicMixinButtonProps } from "../MixinButton";

function FormFieldMixinButton<E extends ElementType>(props: PolymorphicMixinButtonProps<E>) {
    const { describedBy } = useFormFieldContext();
    return <MixinButton {...props} aria-describedby={describedBy} />
}

export default FormFieldMixinButton;
