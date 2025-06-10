import { ElementType, HTMLAttributes } from "react";
import PolymorphicProps from "../../types/PolymorphicProps";

type ButtonProps = {
    options: {
        size: "mixin-button-sm" | "mixin-button-base";
        theme?: "theme-button-generic-white" | "theme-button-generic-yellow" | "theme-button-generic-green" | "theme-button-generic-red";
    };
    isStatic?: boolean;
    active?: boolean;
    hasShadow?: boolean;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

type PolymorphicMixinButtonProps<E extends ElementType> = PolymorphicProps<E> & ButtonProps;
type RenderedMixinButtonProps = ButtonProps & { children: (props: HTMLAttributes<HTMLButtonElement>) => React.ReactElement };

export default function MixinButton<E extends ElementType = "button">(props: PolymorphicMixinButtonProps<E>) {
    const { as, children, ...rest } = props;
    const Component = as ?? "button";
    const finalProps = _createButtonProps(rest);

    return <Component {...finalProps}>{children}</Component>;
}

export function RenderedMixinButton(props: RenderedMixinButtonProps) {
    const { children, ...rest } = props;
    const finalProps = _createButtonProps(rest);
    return children(finalProps);
}

function _createButtonProps(props: ButtonProps) {
    const { options, active = false, className, isStatic = false, hasShadow = false, ...HTMLattrs } = props;

    const staticMixinClass = isStatic ? "mixin-button-like--static" : "";
    const staticThemeClass = isStatic ? `${options.theme}--static` : "";
    const hasShadowClass = hasShadow ? `shadow` : "";

    return {
        "data-active": active,
        className: ["mixin-button-like", options.size, options.theme, className, staticMixinClass, staticThemeClass, hasShadowClass].join(" "),
        ...HTMLattrs,
    };
}