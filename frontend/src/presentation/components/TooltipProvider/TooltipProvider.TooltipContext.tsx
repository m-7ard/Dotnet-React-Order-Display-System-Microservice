import createSafeContext from "../../utils/createSafeContext";

export const [TooltipContext, useTooltipContext] = createSafeContext<{
    elements: {
        referenceElement: HTMLElement | null;
        setReferenceElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
        targetElement: HTMLElement | null;
        setTargetElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    };
    positioning: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
    };
}>("useTooltipContext has to be used within <TooltipContext.Provider>");
