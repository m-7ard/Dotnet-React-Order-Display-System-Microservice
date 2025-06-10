import { useFormFieldContext } from "../../../Forms/FormField.Context";
import StatelessRadioCheckboxField, { IStatelessRadioCheckboxFieldProps } from "../StatelessRadioCheckboxField";

function FormFieldStatelessRadioCheckboxField(props: IStatelessRadioCheckboxFieldProps) {
    const { id, describedBy } = useFormFieldContext();
    return <StatelessRadioCheckboxField {...props} id={id} aria-describedby={describedBy}/>
}

export default FormFieldStatelessRadioCheckboxField;
