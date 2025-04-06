/* eslint-disable @typescript-eslint/no-explicit-any */
import createSafeContext from "../../utils/createSafeContext";
import { DialogData } from "./GlobalDialog.Manager";

export const [GlobalDialogContext, useGlobalDialogContext] = createSafeContext<{
    dispatchDialog: (ID: string, data: DialogData) => void;
    closeDialog: (ID: string) => void;
    dialogExists: (ID: string) => boolean;
    updateDialog: (ID: string, data: any) => void;
}>("useGlobalDialogContext must be used within GlobalDialogContext.Provider.");