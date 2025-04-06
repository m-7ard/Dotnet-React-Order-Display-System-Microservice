import { ElementType, PropsWithChildren } from "react";
import PolymorphicProps from "../../types/PolymorphicProps";
import contentGridDirective, { ContentGridDirectiveExpression } from "../../directives/contentGridDirective";
import DirectiveFn from "../../types/DirectiveFn";
import useDirectivesAsAttrs from "../../hooks/useDirectivesAsAttrs";
import contentGridTrackDirective, { ContentGridTrackDirectiveExpression } from "../../directives/contentGridTrackDirective";

type MixinPageProps<E extends ElementType> = PolymorphicProps<E> & {
    exp: ContentGridDirectiveExpression;
    directives?: Array<DirectiveFn>;
};

export default function MixinContentGrid<T extends ElementType = "div">(props: PropsWithChildren<MixinPageProps<T>>) {
    const { as, exp, directives = [], className = "", children, ...HTMLattrs } = props;
    const Component = as ?? "div";

    const hostAttrs = useDirectivesAsAttrs({ attrs: HTMLattrs, classNames: [className] }, [contentGridDirective(exp), ...directives]);

    return <Component {...hostAttrs}>{children}</Component>;
}

type MixinContentGridTrackProps<E extends ElementType> = PolymorphicProps<E> & {
    exp: ContentGridTrackDirectiveExpression;
    directives?: Array<DirectiveFn>;
};

export function MixinContentGridTrack<T extends ElementType = "div">(props: PropsWithChildren<MixinContentGridTrackProps<T>>) {
    const { as, className = "", children, directives = [], exp, ...HTMLattrs } = props;
    const Component = as ?? "div";

    const hostAttrs = useDirectivesAsAttrs({ attrs: HTMLattrs, classNames: [className] }, [contentGridTrackDirective(exp), ...directives]);

    return <Component {...hostAttrs}>{children}</Component>;
}
