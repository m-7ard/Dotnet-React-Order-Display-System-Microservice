import Directive from "../types/Directive";

const panelSectionDirective: Directive = () => {
    return (data) => {
        const newData = { ...data };
        data.attrs["data-role"] = "panel-section";
        return newData;
    };
};

export default panelSectionDirective;
