import IPlainApiError from "../../infrastructure/interfaces/IPlainApiError";

interface ErrorStructure {
    _?: string[];
    [key: string]: ErrorStructure | string[] | undefined;
}

export class ErrorBuilder {
    private errors: ErrorStructure;

    constructor() {
        this.errors = {};
    }

    addError(path: string, error: string): this {
        const segments = path.split("/");
        this.addNestedError(this.errors, segments, error);
        return this;
    }

    private addNestedError(errors: ErrorStructure, segments: string[], error: string): void {
        const [currentSegment, ...remainingSegments] = segments;

        if (remainingSegments.length === 0) {
            if (currentSegment === "_") {
                errors["_"] = errors["_"] ?? [];
                errors._.push(error);
            } else {
                errors[currentSegment] = errors[currentSegment] ?? [];
            
                if (Array.isArray(errors[currentSegment])) {
                    errors[currentSegment].push(error);
                }
            }
        } else {
            errors[currentSegment] = errors[currentSegment] ?? {};

            if (typeof errors[currentSegment] === "object" && !Array.isArray(errors[currentSegment])) {
                this.addNestedError(errors[currentSegment], remainingSegments, error);
            }
        }
    }

    build() {
        return this.errors;
    }
}

export default function apiToDomainCompatibleFormError<T extends ErrorStructure>(errors: IPlainApiError[]) {
    const Builder = new ErrorBuilder();
    
    errors.forEach((error) => {
        Builder.addError(error.path, error.message);
    });

    return Builder.build() as T;
}
