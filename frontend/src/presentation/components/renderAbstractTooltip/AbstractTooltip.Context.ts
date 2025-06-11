import createSafeContext from "../../utils/createSafeContext";

export const [AbstractTooltipContext, useAbstractTooltipContext] = createSafeContext<{
    onClose: () => void;
}>("useAbstractTooltipContext must be used within AbstractTooltipContext.Provider.");
