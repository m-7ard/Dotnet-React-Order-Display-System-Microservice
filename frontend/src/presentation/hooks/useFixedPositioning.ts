import { useCallback, useState, useLayoutEffect } from "react";
import fitFixedContainer from "../utils/fixedContainers/fitFixedContainer";
import positionFixedContainer from "../utils/fixedContainers/positionFixedContainer";

export default function useFixedPositioning({ targetElement, referenceElement, positioning }: { targetElement: HTMLElement | null; referenceElement: HTMLElement | null; positioning: Record<string, string> }) {
    const resizeWindow = useCallback(() => {
        if (targetElement == null || referenceElement == null) {
            return;
        }

        positionFixedContainer(targetElement, referenceElement, positioning);
        fitFixedContainer(targetElement);
    }, [targetElement, referenceElement, positioning]);

    const [positionFlag, setPositionFlag] = useState(false);
    useLayoutEffect(() => {
        if (targetElement == null || referenceElement == null) {
            return;
        }

        setTimeout(() => {
            // Needs to happen on the next iteration of the event
            // loop to account for router transitions
            resizeWindow();
            window.addEventListener("resize", resizeWindow);
            setPositionFlag(true);
        }, 0);

        return () => {
            window.removeEventListener("resize", resizeWindow);
        };
    }, [targetElement, referenceElement, positioning, resizeWindow]);

    return { positionFlag, resizeWindow };
}
