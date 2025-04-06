import React, { ElementType, FunctionComponent, useCallback, useEffect, useState } from "react";
import TooltipProvider, { ITooltipPositioning } from "../TooltipProvider/TooltipProvider";
import { useTooltipContext } from "../TooltipProvider/TooltipProvider.TooltipContext";
import useFixedPositioning from "../../hooks/useFixedPositioning";
import { createPortal } from "react-dom";
import { AbstractTooltipContext, useAbstractTooltipContext } from "./AbstractTooltip.Context";
import PolymorphicProps from "../../types/PolymorphicProps";

const defaultElement = "div";

export default function AbstractTooltip(props: {
    Trigger: FunctionComponent<{ open: boolean; onToggle: () => void }>;
    Panel: React.ReactNode;
    positioning: ITooltipPositioning;
}) {
    const { Trigger, Panel, positioning } = props;
    const [open, setOpen] = useState(false);
    const onClose = useCallback(() => setOpen(false), []);

    return (
        <AbstractTooltipContext.Provider value={{ onClose: onClose }}>
            <TooltipProvider positioning={positioning}>
                <Trigger open={open} onToggle={() => setOpen(!open)} />
                {open && createPortal(Panel, document.body)}
            </TooltipProvider>
        </AbstractTooltipContext.Provider>
    );
}

//
// Panel
//

type AbstractTooltipPanelProps<E extends ElementType> = PolymorphicProps<E> & {};

export function AbstractTooltipDefaultPanel<E extends ElementType>(props: AbstractTooltipPanelProps<E>) {
    const { children, as, ...rest } = props;
    const Component = as ?? defaultElement;

    const { onClose } = useAbstractTooltipContext();
        
    //
    //
    // Positioning
    //
    const {
        elements: { setTargetElement, targetElement, referenceElement },
        positioning,
    } = useTooltipContext();

    const { positionFlag } = useFixedPositioning({ positioning, targetElement, referenceElement });
    
    //
    //
    // On outside click
    //
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

    return (
        <Component {...rest} ref={setTargetElement}>
            {children}
        </Component>
    );
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
