import DirectiveFn from "../types/DirectiveFn";

type Directive<T extends unknown[] = []> = (...args: T) => DirectiveFn;

export default Directive;
