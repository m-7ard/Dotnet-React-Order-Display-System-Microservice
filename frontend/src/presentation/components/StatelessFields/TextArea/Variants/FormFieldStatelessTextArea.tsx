import { useFormFieldContext } from "../../../Forms/FormField.Context";
import StatelessTextArea, { IStatelessTextAreaProps } from "../StatelessTextArea";

function FormFieldStatelessTextArea(props: IStatelessTextAreaProps) {
    const { id, describedBy } = useFormFieldContext();
    return <StatelessTextArea {...props} aria-describedby={describedBy} id={id} />
}

export default FormFieldStatelessTextArea;
