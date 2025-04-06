import Directive from "../types/Directive";

const OPTIONS = {
    SIZE: {
        BASE: "mixin-page-base",
    },
};

export type PageDirectiveExpression = (options: typeof OPTIONS) => { size: string } 

const pageDirective: Directive<[PageDirectiveExpression]> = (options) => {
    return (data) => {
        const newData = { ...data };
        const { size } = options(OPTIONS);
        data.classNames.push("mixin-page-like");
        data.classNames.push(size);
        return newData;
    };
};

export default pageDirective;
