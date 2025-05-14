import IDjangoErrors from "./IDjangoError";
import ApplicationError from "./ApplicationError";

class ApplicationErrorFactory {
    static djangoErrorsToApiErrors(errors: IDjangoErrors): ApplicationError[] {
        const { non_field_errors, ...fieldErrors } = errors;
        const results: ApplicationError[] = Object.entries(fieldErrors).map(([field, msg]) => new ApplicationError(msg as string, "Django Error", [field]));
        if (non_field_errors != null) {
            results.push(...non_field_errors.map((msg) => new ApplicationError(msg as string, "Django Error", [])));
        }

        return results;
    }
}

export default ApplicationErrorFactory;
