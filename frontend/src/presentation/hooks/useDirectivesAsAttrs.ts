import { HTMLAttributes } from "react";
import DirectiveData from "../types/DirectiveData";
import DirectiveFn from "../types/DirectiveFn";

function useDirectivesAsAttrs(data: DirectiveData, directives: Array<DirectiveFn>): HTMLAttributes<HTMLElement> {
    const result = directives.reduce((acc, directive) => directive(acc), data);

    return {
        className: result.classNames.join(" "),
        ...result.attrs
    };
}

export default useDirectivesAsAttrs;