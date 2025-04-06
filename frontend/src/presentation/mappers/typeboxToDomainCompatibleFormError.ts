import { ValueError } from "@sinclair/typebox/errors";
import JSONPointer from "jsonpointer";

interface ErrorStructure {
    _?: string[];
    [key: string]: ErrorStructure | string[] | undefined;
}

export default function typeboxToDomainCompatibleFormError<T extends ErrorStructure>(errors: ValueError[]): T {
    const result: ErrorStructure = {};

    errors.forEach((error) => {
        const suffixPath: string | undefined = error.schema.suffixPath;
        const customPath: string | undefined = error.schema.customPath;

        if (customPath != null) {
            error.path = customPath;
        }

        if (suffixPath != null) {
            error.path += suffixPath;
        }

        const existingValue = JSONPointer.get(result, error.path);
        if (existingValue == null) {
            JSONPointer.set(result, error.path, [error.message]);
        } else if (Array.isArray(existingValue)) {
            existingValue.push(error.message);
        }
    });

    return result as T;
}