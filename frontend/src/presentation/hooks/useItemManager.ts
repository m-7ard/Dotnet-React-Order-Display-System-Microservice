import { useCallback, useState } from "react";

export interface IItemManager<T> {
    items: T;
    setAll: (items: T) => void;
    addItem: (key: string, items: T[keyof T]) => void;
    deleteItem: <K extends keyof T>(key: K) => void;
    updateItem: <K extends keyof T>(key: K, items: T[K] | ((prev: T[K]) => T[K])) => void;
}

export default function useItemManager<T>(initialData: T): IItemManager<T> {
    
    const [items, setItems] = useState<T>(initialData);

    const setAll = useCallback((data: T) => setItems(data), []);

    const addItem = useCallback((key: string, items: T[keyof T]) => {
        setItems((prev) => ({ ...prev, [key]: items }));
    }, []);

    const deleteItem = useCallback(<K extends keyof T>(key: K) => {
        setItems((prev) => {
            const newState = { ...prev };
            delete newState[key];
            return newState;
        });
    }, []);

    const updateItem = useCallback(<K extends keyof T>(key: K, itemUpdater: T[K] | ((prev: T[K]) => T[K])) => {
        setItems((prev) => {
            const updatedItem =
                typeof itemUpdater === "function" ? (itemUpdater as (prev: T[K]) => T[K])(prev[key]) : itemUpdater;
            return { ...prev, [key]: updatedItem };
        });
    }, []);

    return {
        items,
        setAll,
        updateItem,
        addItem,
        deleteItem,
    };
}
