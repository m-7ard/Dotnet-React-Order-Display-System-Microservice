import JSONPointer from "jsonpointer";
import IPresentationError from "../interfaces/IPresentationError";
import IPlainApiError from "../../infrastructure/interfaces/IPlainApiError";

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
}

export default PresentationErrorFactory;