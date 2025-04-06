import React, { ElementType, HTMLAttributes, PropsWithChildren } from "react";
import PolymorphicProps from "../../types/PolymorphicProps";
import useDirectives from "../../hooks/useDirectives";
import panelSectionDirective from "../../directives/panelSectionDirective";
import panelDirective, { PanelDirectiveExpression } from "../../directives/panelDirective";
import useDirectivesAsAttrs from "../../hooks/useDirectivesAsAttrs";
import DirectiveFn from "../../types/DirectiveFn";

type PanelProps = { exp: PanelDirectiveExpression; directives?: Array<DirectiveFn> } & Omit<HTMLAttributes<HTMLElement>, "children">;

/* 
    -----------------------------------------------------
    Polymorphic Panel 
    -----------------------------------------------------
*/
type PolymorphicMixinPanelProps<E extends ElementType> = PolymorphicProps<E> & PanelProps;
export function PolymorphicMixinPanel<T extends ElementType = "div">(props: PropsWithChildren<PolymorphicMixinPanelProps<T>>) {
    const { as, className = "", directives = [], children, exp, ...HTMLattrs } = props;
    const Component = as ?? "div";

    const attrs = useDirectivesAsAttrs({ attrs: HTMLattrs, classNames: [className] }, [...directives, panelDirective(exp)]);

    return <Component {...attrs}>{children}</Component>;
}

/* 
    -----------------------------------------------------
    Render Panel 
    -----------------------------------------------------
*/
type RenderedMixinPanelProps = PanelProps & { children: (props: HTMLAttributes<HTMLElement>) => React.ReactElement };
export function RenderedMixinPanel(props: RenderedMixinPanelProps) {
    const { className = "", exp, children, directives = [] } = props;
    const attrs = useDirectivesAsAttrs({ attrs: {}, classNames: [className] }, [...directives, panelDirective(exp)]);
    return children(attrs);
}

/* 
    -----------------------------------------------------
    Render Section 
    -----------------------------------------------------
*/
type SectionProps = {
    directives?: Array<DirectiveFn>;
} & HTMLAttributes<HTMLElement>;

type RenderedMixinPanelSectionProps = { children: (props: HTMLAttributes<HTMLElement>) => React.ReactElement } & SectionProps;
export function RenderedMixinPanelSection(props: RenderedMixinPanelSectionProps) {
    const { children, className = "", directives = [], ...htmlAttrs } = props;
    const directiveData = useDirectives({ attrs: htmlAttrs, classNames: [className] }, [...directives, panelSectionDirective()]);
    return children({ className: directiveData.classNames.join(" "), ...directiveData.attrs });
}

/* 
    -----------------------------------------------------
    Polymorphic Section 
    -----------------------------------------------------
*/
type PolymorphicMixinPanelSectionProps<E extends ElementType> = PolymorphicProps<E> & SectionProps;
export function PolymorphicMixinPanelSection<T extends ElementType = "section">(props: PropsWithChildren<PolymorphicMixinPanelSectionProps<T>>) {
    const { as, className = "", children, ...HTMLattrs } = props;
    const Component = as ?? "section";
    const directiveData = useDirectives({ attrs: HTMLattrs, classNames: [className] }, [panelSectionDirective()]);

    return (
        <Component className={directiveData.classNames.join(" ")} {...directiveData.attrs}>
            {children}
        </Component>
    );
}
