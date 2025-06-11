import { useFormFieldContext } from "../../../Forms/FormField.Context";
import StatelessBooleanCheckbox, { IStatelessBooleanCheckboxProps } from "../StatelessBooleanCheckbox";

function FormFieldStatelessBooleanCheckbox(props: IStatelessBooleanCheckboxProps) {
    const { id, describedBy } = useFormFieldContext();
    return <StatelessBooleanCheckbox {...props} aria-describedby={describedBy} id={id} />
}

export default FormFieldStatelessBooleanCheckbox;