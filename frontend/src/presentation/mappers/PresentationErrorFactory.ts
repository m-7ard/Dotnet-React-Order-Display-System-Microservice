import JSONPointer from "jsonpointer";
import IPresentationError from "../interfaces/IPresentationError";
import IPlainApiError from "../../infrastructure/interfaces/IPlainApiError";
import IDjangoErrors from "../../infrastructure/interfaces/IDjangoError";

class PresentationErrorFactory {
    static ApiErrorsToPresentationErrors<T>(errors: IPlainApiError[]) {
        const result: IPresentationError<T> = {};

        errors.forEach((error) => {
            const existingValue = JSONPointer.get(result, error.path);
            if (existingValue == null) {
                JSONPointer.set(result, error.path, [error.message]);
            } else if (Array.isArray(existingValue)) {
                existingValue.push(error.message);
            }
        });
    
        return result;
    }

    static DjangoErrorsToPresentationErrors<T>(errors: IDjangoErrors) {
        const { non_field_errors, ...fieldErrors } = errors;
        const results: IPresentationError<T> = { ...fieldErrors };
        if (non_field_errors != null) {
            results._ = non_field_errors;
        }
        
        return results;
    }
}

export default PresentationErrorFactory;