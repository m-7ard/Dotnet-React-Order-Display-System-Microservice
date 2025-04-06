import Directive from "../types/Directive";

const OPTIONS = {
    DEFAULT_TRACKS: {
        BASE: "base",
        FULL: "full",
    },
} as const;

export type ContentGridDirectiveExpression = (options: typeof OPTIONS) => {
    defaultTracks?: (typeof OPTIONS.DEFAULT_TRACKS)[keyof typeof OPTIONS.DEFAULT_TRACKS];
};

const contentGridDirective: Directive<[ContentGridDirectiveExpression]> = (options) => {
    return (data) => {
        const { defaultTracks = "base" } = options(OPTIONS);

        const newData = { ...data };
        data.classNames.push("mixin-content-grid");
        data.attrs["data-default-track"] = defaultTracks;
        return newData;
    };
};

export default contentGridDirective;
