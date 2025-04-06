import DirectiveData from "../types/DirectiveData";
import DirectiveFn from "../types/DirectiveFn";

function useDirectives(data: DirectiveData, directives: Array<DirectiveFn>) {
    return directives.reduce((acc, directive) => directive(acc), data);
}

export default useDirectives;