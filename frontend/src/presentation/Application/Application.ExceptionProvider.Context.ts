import createSafeContext from "../utils/createSafeContext";

export const [ApplicationExceptionContext, useApplicationExceptionContext] = createSafeContext<{
    dispatchException: (error: unknown) => void;
    exception: Error | null;
    dismissException: () => void;
}>("useApplicationExceptionContext must be used within ApplicationExceptionContext.Provider.");