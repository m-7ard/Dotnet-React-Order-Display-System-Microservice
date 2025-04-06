import Directive from "../types/Directive";

const OPTIONS = {
    SIZE: {
        BASE: "mixin-panel-base",
    },
    THEMES: {
        GENERIC_WHITE: "theme-panel-generic-white",
    },
} as const;

export type PanelDirectiveExpression = (options: typeof OPTIONS) => {
    size: (typeof OPTIONS.SIZE)[keyof typeof OPTIONS.SIZE];
    theme: (typeof OPTIONS.THEMES)[keyof typeof OPTIONS.THEMES];
    hasShadow?: boolean;
    hasBorder?: boolean;
};

const panelDirective: Directive<[PanelDirectiveExpression]> = (options) => {
    return (data) => {
        const newData = { ...data };
        const { size, theme, hasBorder = false, hasShadow = false } = options(OPTIONS);

        data.classNames.push("mixin-panel-like");
        data.classNames.push(size);
        data.classNames.push(theme);

        if (hasBorder) {
            data.classNames.push("border token-default-border-color");
        }

        if (hasShadow) {
            data.classNames.push("token-default-shadow");
        }

        return newData;
    };
};

export default panelDirective;
