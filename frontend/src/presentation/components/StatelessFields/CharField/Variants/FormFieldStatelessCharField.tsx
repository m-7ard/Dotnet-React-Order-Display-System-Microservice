import { useFormFieldContext } from "../../../Forms/FormField.Context";
import StatelessCharField, { IStatelessCharFieldProps } from "../StatelessCharField";

function FormFieldStatelessCharField(props: IStatelessCharFieldProps) {
    const { id, describedBy } = useFormFieldContext();
    return <StatelessCharField {...props} aria-describedby={describedBy} id={id} />
}

export default FormFieldStatelessCharField;