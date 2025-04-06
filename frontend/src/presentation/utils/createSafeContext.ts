import { createContext, useContext } from "react";

export default function createSafeContext<T>(errorMessage: string): [React.Context<T | null>, () => T] {
    const context = createContext<T | null>(null);
    const useContextFn = () => {
        const contextValue = useContext(context);

        if (contextValue == null) {
            throw new Error(errorMessage);
        }

        return contextValue;
    };
    return [context, useContextFn];
};