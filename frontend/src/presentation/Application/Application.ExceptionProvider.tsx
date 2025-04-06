import { PropsWithChildren, useCallback, useState } from "react";
import { ApplicationExceptionContext } from "./Application.ExceptionProvider.Context";

export default function ExceptionProvider({ children }: PropsWithChildren) {
    const [exception, setException] = useState<Error | null>(null);

    const dispatchException = useCallback((error: unknown) => {
        console.log(error);
        
        if (error instanceof Error) {
            setException(error);
        } else {
            setException(new Error(JSON.stringify(error)));
        }

        console.error(error);
    }, []);

    const dismissException = useCallback(() => setException(null), []);

    return (
        <ApplicationExceptionContext.Provider
            value={{
                dispatchException: dispatchException,
                exception: exception,
                dismissException: dismissException,
            }}
        >
            {children}
        </ApplicationExceptionContext.Provider>
    );
}
