import createSafeContext from "../../utils/createSafeContext";

export const [GlobalDialogPanelContext, useGlobalDialogPanelContext] = createSafeContext<{
    onClose: () => void;
}>("useGlobalDialogPanelContext must be used within GlobalDialogPanelContext.Provider.");