import { useFormFieldContext } from "../../Forms/FormField.Context";
import OrderItemDataField, { IOrderItemDataFieldProps } from "../OrderItemDataField";

function FormFieldOrderItemDataField(props: IOrderItemDataFieldProps) {
    const { describedBy, id } = useFormFieldContext();
    console.log(describedBy, id)
    return <OrderItemDataField {...props} aria-describedby={describedBy} id={id}/>
}

export default FormFieldOrderItemDataField;
