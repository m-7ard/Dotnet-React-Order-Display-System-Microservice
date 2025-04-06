import Directive from "../types/Directive";

const pageSectionDirective: Directive = () => {
    return (data) => {
        const newData = { ...data };
        data.attrs["data-role"] = "page-section";
        return newData;
    };
};

export default pageSectionDirective;
