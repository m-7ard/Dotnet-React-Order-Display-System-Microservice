import Directive from "../types/Directive";

const OPTIONS = {
    TRACK: {
        SM: "sm",
        BASE: "base",
        LG: "lg",
        FULL: "full",
    },
} as const;

export type ContentGridTrackDirectiveExpression = (options: typeof OPTIONS) => {
    track: (typeof OPTIONS.TRACK)[keyof typeof OPTIONS.TRACK];
};

const contentGridTrackDirective: Directive<[ContentGridTrackDirectiveExpression]> = (expression) => {
    return (data) => {
        const newData = { ...data };
        const { track } = expression(OPTIONS);
        data.attrs["data-track"] = track;
        return newData;
    };
};

export default contentGridTrackDirective;
