import { useState } from "react";
import { TooltipContext } from "./TooltipProvider.TooltipContext";

export type ITooltipPositioning = {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
};

export default function TooltipProvider(
    props: React.PropsWithChildren<{
        positioning: ITooltipPositioning;
    }>,
) {
    const { positioning, children } = props;
    const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

    return (
        <TooltipContext.Provider
            value={{
                positioning: positioning,
                elements: {
                    referenceElement: referenceElement,
                    setReferenceElement: setReferenceElement,
                    targetElement: targetElement,
                    setTargetElement: setTargetElement,
                },
            }}
        >
            {children}
        </TooltipContext.Provider>
    );
}
