import { useFormFieldContext } from "../../FormField.Context";
import UploadImagesForm, { IImageUploadFormProps } from "../UploadImagesForm";

function FormFieldImageUploadForm(props: IImageUploadFormProps) {
    const { id, describedBy } = useFormFieldContext();

    return <UploadImagesForm {...props} id={id} describedBy={describedBy}/>
}

export default FormFieldImageUploadForm;
