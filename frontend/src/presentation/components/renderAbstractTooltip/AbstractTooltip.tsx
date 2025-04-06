import React, { ElementType, FunctionComponent, PropsWithChildren, useCallback, useEffect, useState } from "react";
import TooltipProvider, { ITooltipPositioning } from "../TooltipProvider/TooltipProvider";
import { useTooltipContext } from "../TooltipProvider/TooltipProvider.TooltipContext";
import useFixedPositioning from "../../hooks/useFixedPositioning";
import { createPortal } from "react-dom";
import PolymorphicProps from "../../types/PolymorphicProps";
import { AbstractTooltipContext, useAbstractTooltipContext } from "../AbtractTooltip/AbstractTooltip.Context";

const defaultElement = "div";

export default function AbstractTooltip(props: {
    Trigger: FunctionComponent<{ open: boolean; onToggle: () => void }>;
    Panel: (props?: { onClose: () => void }) => React.ReactNode;
    positioning: ITooltipPositioning;
}) {
    const { Trigger, Panel, positioning } = props;
    const [open, setOpen] = useState(false);
    const onClose = useCallback(() => setOpen(false), []);

    return (
        <AbstractTooltipContext.Provider value={{ onClose: onClose }}>
            <TooltipProvider positioning={positioning}>
                <Trigger open={open} onToggle={() => setOpen(!open)} />
                {open && createPortal(<Panel onClose={onClose} />, document.body)}
            </TooltipProvider>
        </AbstractTooltipContext.Provider>
    );
}

//
// Panel
//

function useDefaultAbstractTooltipSetup() {
    const { onClose } = useAbstractTooltipContext();

    // Positioning
    const {
        elements: { setTargetElement, targetElement, referenceElement },
        positioning,
    } = useTooltipContext();

    const { positionFlag } = useFixedPositioning({ positioning, targetElement, referenceElement });

    // On outside click
    const closeOnOutsideClick = useCallback(
        (e: MouseEvent) => {
            if (!targetElement?.contains(e.target as Node)) {
                onClose();
            }
        },
        [targetElement, onClose],
    );

    useEffect(() => {
        if (positionFlag == false) return;
        window.addEventListener("click", closeOnOutsideClick);
        return () => window.removeEventListener("click", closeOnOutsideClick);
    }, [closeOnOutsideClick, positionFlag]);

    return { setTargetElement };
}

type PolymorphicAbstractTooltipPanelProps<E extends ElementType> = PolymorphicProps<E> & {};

export function PolymorphicAbstractTooltipDefaultPanel<E extends ElementType = typeof defaultElement>(props: PolymorphicAbstractTooltipPanelProps<E>) {
    const { children, as, ...rest } = props;
    const Component = as ?? defaultElement;

    const { setTargetElement } = useDefaultAbstractTooltipSetup();

    return (
        <Component {...rest} ref={setTargetElement}>
            {children}
        </Component>
    );
}

type THostElementProps = React.JSX.IntrinsicAttributes & PropsWithChildren<{ ref: React.Dispatch<React.SetStateAction<HTMLElement | null>> }>;

type RenderedAbstractTooltipPanelProps = {
    children: (tooltipPanelProps: THostElementProps) => React.ReactNode;
};

export function RenderedAbstractTooltipDefaultPanel(props: RenderedAbstractTooltipPanelProps) {
    const { children } = props;

    const { setTargetElement } = useDefaultAbstractTooltipSetup();

    const hostElementProps: THostElementProps = { ref: setTargetElement };
    return children(hostElementProps);
}

//
// Trigger
//

type AbstractTooltipTriggerProps<E extends ElementType> = PolymorphicProps<E> & {};

export function AbstractTooltipTrigger<E extends ElementType>(props: AbstractTooltipTriggerProps<E>) {
    const { children, as, ...rest } = props;
    const {
        elements: { setReferenceElement },
    } = useTooltipContext();
    const Component = as ?? defaultElement;

    return (
        <Component {...rest} ref={setReferenceElement}>
            {children}
        </Component>
    );
}
