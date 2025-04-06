import { ComponentPropsWithoutRef, ElementType, HTMLAttributes, PropsWithChildren } from "react";

type PolymorphicAsProp<E extends ElementType> = {
    as?: E;
};

type PolymorphicProps<E extends ElementType> = PropsWithChildren<ComponentPropsWithoutRef<E> & PolymorphicAsProp<E> & HTMLAttributes<HTMLElement>>;

export default PolymorphicProps;