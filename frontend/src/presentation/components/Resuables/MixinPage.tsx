import { ElementType, PropsWithChildren } from "react";
import PolymorphicProps from "../../types/PolymorphicProps";
import useDirectivesAsAttrs from "../../hooks/useDirectivesAsAttrs";
import pageDirective, { PageDirectiveExpression } from "../../directives/pageDirective";
import DirectiveFn from "../../types/DirectiveFn";
import pageSectionDirective from "../../directives/pageSectionDirective";

type MixinPageProps<E extends ElementType> = PolymorphicProps<E> & {
    exp: PageDirectiveExpression;
    directives?: Array<DirectiveFn>;
};

export default function MixinPage<T extends ElementType = "div">(props: PropsWithChildren<MixinPageProps<T>>) {
    const { exp, as, className = "", children, directives = [], ...HTMLattrs } = props;
    const Component = as ?? "div";

    const hostAttributes = useDirectivesAsAttrs({ attrs: HTMLattrs, classNames: [className] }, [pageDirective(exp), ...directives]);

    return <Component {...hostAttributes}>{children}</Component>;
}

type MixinPageSectionProps<E extends ElementType> = PolymorphicProps<E> & {
    directives?: Array<DirectiveFn>;
};

export function MixinPageSection<T extends ElementType = "section">(props: PropsWithChildren<MixinPageSectionProps<T>>) {
    const { as, className = "", directives = [], children, ...HTMLattrs } = props;
    const Component = as ?? "section";

    const hostAttributes = useDirectivesAsAttrs({ attrs: HTMLattrs, classNames: [className] }, [pageSectionDirective(), ...directives]);

    return <Component {...hostAttributes}>{children}</Component>;
}
